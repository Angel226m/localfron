 


import React, { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';

// Para extender las props y manejar tanto input como textarea
interface FormInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'as'> {
  label?: string;
  error?: string;
  className?: string;
  as?: 'input' | 'textarea';
  rows?: number;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  error,
  className = '',
  as = 'input',
  rows = 3,
  ...props
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label
          htmlFor={props.id || props.name}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {as === 'textarea' ? (
        <textarea
          id={props.id || props.name as string}
          name={props.name}
          className={`block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm
            ${error ? 'border-red-300' : 'border-gray-300'}
            ${props.disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
          `}
          rows={rows}
          onChange={props.onChange as any}
          value={props.value}
          placeholder={props.placeholder}
          disabled={props.disabled}
          required={props.required}
        />
      ) : (
        <input
          id={props.id || props.name as string}
          className={`block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm
            ${error ? 'border-red-300' : 'border-gray-300'}
            ${props.disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
          `}
          {...props}
        />
      )}
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default FormInput;