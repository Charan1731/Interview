import React from 'react'
import { FormItem, FormLabel, FormControl, FormMessage } from './ui/form'
import { Input } from './ui/input'
import { Controller, FieldValues, Path, Control } from 'react-hook-form'

interface FormFieldTypeProps<T extends FieldValues> {
  control: Control<T>
  name: Path<T>
  label: string
  placeholder?: string
  type?: "text" | "email" | "password" | "file";
}

const FormField = <T extends FieldValues>({control, name, label, placeholder, type="text"}: FormFieldTypeProps<T>) => {
  const getFieldIcon = () => {
    switch (type) {
      case 'email':
        return (
          <svg className="w-5 h-5 text-light-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
          </svg>
        );
      case 'password':
        return (
          <svg className="w-5 h-5 text-light-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        );
      case 'text':
        return (
          <svg className="w-5 h-5 text-light-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className="space-y-3">
          <FormLabel className="label text-base font-medium text-light-100">
            {label}
          </FormLabel>
          <FormControl>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-200/10 to-primary-300/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
              <div className="relative flex items-center">
                <div className="absolute left-0 ml-5 z-10 transition-colors duration-200 group-focus-within:text-primary-200">
                  {getFieldIcon()}
                </div>
                <Input 
                  className="input pl-12 ml-5 pr-4 transition-all duration-200 focus:shadow-lg focus:shadow-primary-200/10 group-hover:border-primary-200/30 focus:border-primary-200/50" 
                  type={type} 
                  placeholder={placeholder} 
                  {...field}
                />
              </div>
              {fieldState.error && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">
                  <svg className="w-5 h-5 text-destructive-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              )}
            </div>
          </FormControl>
          <FormMessage className="text-destructive-100 text-sm font-medium animate-fadeIn" />
        </FormItem>
      )}
    />
  )
}

export default FormField