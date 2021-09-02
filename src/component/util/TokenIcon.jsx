import { QuestionMarkCircleIcon } from '@heroicons/react/solid'

export default function TokenIcon({ name = 'Token Logo', logoURI }) {
  if (!logoURI) {
    return (
      <QuestionMarkCircleIcon className="h-5 w-5 md:h-10 md:w-10 rounded-full text-gray-900 bg-gray-800 inline-block" />
    )
  }

  return (
    <img
      className="h-5 w-5 md:h-10 md:w-10 rounded-full bg-gray-800 inline-block"
      src={logoURI}
      alt={name}
    />
  )
}
