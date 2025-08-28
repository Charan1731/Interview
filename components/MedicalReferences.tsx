"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Temporary placeholder function for medical references
const searchMedicalReferences = async (query: string): Promise<MedicalReference[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return [
    {
      title: `${query} - Clinical Guidelines and Diagnosis`,
      url: `https://pubmed.ncbi.nlm.nih.gov/search?term=${encodeURIComponent(query)}`,
      source: 'pubmed',
      relevanceScore: 0.95,
    },
    {
      title: `${query} - Treatment Protocols and Management`,
      url: `https://reference.medscape.com/search?q=${encodeURIComponent(query)}`,
      source: 'medscape',
      relevanceScore: 0.90,
    },
    {
      title: `${query} - Differential Diagnosis and Clinical Pearls`,
      url: `https://www.uptodate.com/search?search=${encodeURIComponent(query)}`,
      source: 'uptodate',
      relevanceScore: 0.88,
    },
  ];
};

interface MedicalReferencesProps {
  initialQuery?: string;
  onReferenceSelect?: (reference: MedicalReference) => void;
}

const MedicalReferences = ({ initialQuery = '', onReferenceSelect }: MedicalReferencesProps) => {
  const [query, setQuery] = useState(initialQuery);
  const [references, setReferences] = useState<MedicalReference[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery);
    }
  }, [initialQuery]);

  const handleSearch = async (searchQuery: string = query) => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const results = await searchMedicalReferences(searchQuery);
      setReferences(results);
      
      // Add to search history
      setSearchHistory(prev => {
        const newHistory = [searchQuery, ...prev.filter(item => item !== searchQuery)];
        return newHistory.slice(0, 5); // Keep only last 5 searches
      });
    } catch (error) {
      console.error('Error searching medical references:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSourceIcon = (source: string) => {
    const icons = {
      pubmed: '📚',
      medscape: '🏥',
      uptodate: '📖',
    };
    return icons[source as keyof typeof icons] || '📄';
  };

  const getSourceColor = (source: string) => {
    const colors = {
      pubmed: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      medscape: 'bg-green-500/20 text-green-400 border-green-500/30',
      uptodate: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    };
    return colors[source as keyof typeof colors] || 'bg-neutral-500/20 text-neutral-400 border-neutral-500/30';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center flex-shrink-0">
          <span className="text-xl">📚</span>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-2">Medical References</h3>
          <p className="text-sm text-light-100">Search PubMed, Medscape, and UpToDate for clinical information</p>
        </div>
      </div>

      {/* Search Input */}
      <div className="flex gap-2">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search medical literature..."
          className="flex-1 bg-dark-200 border-neutral-700 text-white placeholder-light-100"
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button 
          onClick={() => handleSearch()}
          disabled={loading || !query.trim()}
          className="bg-primary-500 hover:bg-primary-600"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            'Search'
          )}
        </Button>
      </div>

      {/* Search History */}
      {searchHistory.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-light-100">Recent Searches</p>
          <div className="flex flex-wrap gap-2">
            {searchHistory.map((historyItem, index) => (
              <button
                key={index}
                onClick={() => {
                  setQuery(historyItem);
                  handleSearch(historyItem);
                }}
                className="px-3 py-1 text-xs bg-dark-200 hover:bg-dark-300 text-light-100 rounded-full border border-neutral-700 transition-colors"
              >
                {historyItem}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-dark-200 rounded-xl h-24"></div>
            </div>
          ))}
        </div>
      ) : references.length > 0 ? (
        <div className="space-y-4">
          {references.map((reference, index) => (
            <Card key={index} className="p-4 bg-dark-200 border-neutral-700 hover:border-primary-500/30 transition-all duration-300 group">
              <div className="flex items-start gap-4">
                <div className="text-2xl">{getSourceIcon(reference.source)}</div>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between gap-4">
                    <h4 className="font-semibold text-white group-hover:text-primary-200 transition-colors line-clamp-2">
                      {reference.title}
                    </h4>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getSourceColor(reference.source)}`}>
                      {reference.source.toUpperCase()}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-light-100">Relevance:</span>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full ${
                              i < Math.round(reference.relevanceScore * 5)
                                ? 'bg-yellow-500'
                                : 'bg-neutral-600'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-light-100">
                        {Math.round(reference.relevanceScore * 100)}%
                      </span>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(reference.url, '_blank')}
                        className="text-primary-200 border-primary-500/30 hover:bg-primary-500/10"
                      >
                        Open
                      </Button>
                      {onReferenceSelect && (
                        <Button
                          size="sm"
                          onClick={() => onReferenceSelect(reference)}
                          className="bg-primary-500 hover:bg-primary-600"
                        >
                          Use
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : query && !loading ? (
        <Card className="p-8 text-center bg-dark-200 border-neutral-700">
          <div className="space-y-4">
            <div className="text-4xl">🔍</div>
            <h3 className="text-lg font-semibold text-white">No Results Found</h3>
            <p className="text-light-100">
              Try different keywords or check your spelling
            </p>
          </div>
        </Card>
      ) : null}
    </div>
  );
};

export default MedicalReferences;
