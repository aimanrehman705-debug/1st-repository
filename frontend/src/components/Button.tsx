import { ButtonHTMLAttributes } from 'react'
import clsx from 'clsx'

export default function Button({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center rounded-md bg-primary-600 px-4 py-2 text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
        'dark:focus:ring-offset-gray-950',
        className
      )}
      {...props}
    />
  )
}
