"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {Form} from "@/components/ui/form"
import Image from "next/image"
import Link from "next/link"
import { toast } from "sonner"
import FormField from "./FormField"
import { useRouter } from "next/navigation"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/firebase/client"
import { signIn, signUp } from "@/lib/actions/auth.action"
import { Eye, EyeOff, Loader2 } from "lucide-react"

const authFormSchema = (type:FormType) => {
  return z.object({
    name: type === "sign-up" ? z.string().min(3) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(8),
  })
}

const AuthForm = ({type}:{type:FormType}) => {

  const router = useRouter();

  const formSchema = authFormSchema(type)

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })
 
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {

      if(type === "sign-up") {

        const {name, email, password} = values;

        const userCredentails = await createUserWithEmailAndPassword(auth, email, password);

        const result = await signUp({
          uid: userCredentails.user.uid,
          name: name!,
          email,
          password,
        })

        if (!result?.success) {
          toast.error(result?.message || 'Failed to create account');
          return;
        }

        toast.success("Account created successfully")
        router.push("/sign-in")
      } else {

        const {email, password} = values;

        const userCredential = await signInWithEmailAndPassword(auth, email, password);

        const idToken = await userCredential.user.getIdToken();

        if(!idToken){
          toast.error("Failed to sign in")
          return;
        }

        const result = await signIn({
          email,
          idToken,
        })

        toast.success("Signed in successfully")
        router.push("/")
      }
      
    } catch (error) {
      console.log(error)
      toast.error(`There is an error: ${error}`)
    } finally {
      setIsLoading(false);
    }
  }

  const isSignIn = type === "sign-in"

  return (
    <div className="relative">
      {/* Background decoration */}
      <div className="absolute -inset-1 bg-gradient-to-r from-primary-200 via-primary-300 to-primary-200 rounded-3xl blur-sm opacity-20 animate-pulse"></div>
      
      <div className="card-border lg:min-w-[600px] relative">
        <div className="flex flex-col gap-6 card py-12 px-8 lg:px-12 relative overflow-hidden">
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary-200/10 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-primary-300/10 to-transparent rounded-full translate-y-12 -translate-x-12"></div>
          
          {/* Header Section */}
          <div className="flex flex-col items-center gap-4 relative z-10">
            <div className="flex flex-row items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-200 to-primary-300 rounded-lg blur opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                <div className="relative bg-gradient-to-r from-primary-200 to-primary-300 p-2 rounded-lg">
                  <Image src="./logo.svg" alt="logo" width={24} height={24} className="brightness-0"/>
                </div>
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-primary-200 via-primary-300 to-primary-200 bg-clip-text text-transparent">
                Mocksy
              </h2>
            </div>
            
            <div className="text-center space-y-1">
              <h3 className="text-xl font-semibold text-white">
                {isSignIn ? "Welcome Back!" : "Join Mocksy Today"}
              </h3>
              <p className="text-light-100 text-base">
                {isSignIn 
                  ? "Continue your journey to interview success" 
                  : "Start practicing job interviews with AI"
                }
              </p>
            </div>
          </div>

          {/* Form Section */}
          <div className="relative z-10">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-5 form">
                {!isSignIn && 
                  <FormField
                    control={form.control}
                    name="name"
                    label="Full Name"
                    placeholder="Enter your full name"
                    type="text"
                  />
                }
                
                <FormField
                  control={form.control}
                  name="email"
                  label="Email Address"
                  placeholder="your.email@example.com"
                  type="email"
                />
                
                <div className="relative">
                  <FormField
                    control={form.control}
                    name="password"
                    label="Password"
                    placeholder={isSignIn ? "Enter your password" : "Create a secure password (min 8 characters)"}
                    type={showPassword ? "text" : "password"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-8 top-[42px] text-light-100 hover:text-white transition-colors duration-200 z-20"
                    aria-label="Toggle password visibility"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                
                <div className="pt-2">
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="btn group relative overflow-hidden transition-all duration-300 hover:scale-[1.02] disabled:hover:scale-100 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        <span className="relative z-10 font-semibold">
                          {isSignIn ? "Signing In..." : "Creating Account..."}
                        </span>
                      </>
                    ) : (
                      <span className="relative z-10 font-semibold">
                        {isSignIn ? "Sign In to Account" : "Create Your Account"}
                      </span>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-300 to-primary-200 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  </Button>
                </div>
              </form>
            </Form>
          </div>

          {/* Footer Section */}
          <div className="text-center relative z-10">
            <div className="flex items-center justify-center gap-4 mb-3">
              <div className="h-px bg-gradient-to-r from-transparent via-primary-200/30 to-transparent flex-1"></div>
              <span className="text-light-100/60 text-sm">or</span>
              <div className="h-px bg-gradient-to-r from-transparent via-primary-200/30 to-transparent flex-1"></div>
            </div>
            
            <p className="text-light-100">
              {isSignIn ? "Don't have an account?" : "Already have an account?"}
              <Link 
                href={isSignIn ? "/sign-up" : "/sign-in"} 
                className={`font-bold text-primary-200 ml-2 hover:text-primary-300 transition-colors duration-200 relative group ${
                  isLoading ? 'pointer-events-none opacity-50' : ''
                }`}
              >
                {isSignIn ? "Sign Up" : "Sign In"}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-200 to-primary-300 group-hover:w-full transition-all duration-300"></span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthForm