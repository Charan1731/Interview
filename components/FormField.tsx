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

const FormField = <T extends FieldValues>({control, name, label, placeholder, type="text"}: FormFieldTypeProps<T>) => (
   <Controller
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormLabel className={label}>{label}</FormLabel>
        <FormControl>
          <Input className='input' type={type} placeholder={placeholder} {...field} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
   />
)

export default FormField