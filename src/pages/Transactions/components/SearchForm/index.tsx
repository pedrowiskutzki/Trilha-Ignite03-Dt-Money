import { SearchFormContainer } from './styles'
import { MagnifyingGlass } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { memo, useContext } from 'react'
import { TransactionsContext } from '../../../../contexts/TransactionsContext'
import { useContextSelector } from 'use-context-selector'

/** 
Por que que um componente renderiza?
- Hooks changed (mudou estado, contexto, reducer);
- Props changed (mudou propriedades);
- Parent rerendered (componente pai renderizou;)

Qual o fluxo de renderização?
1. O React reciar o HTML da interface daquele componente
2. Compara a versão do HTML recriada com a versão anterior
3. SE mudou alguma coisa, ele reescreve o HTML na tela

Memo:
@. Hooks changed, Props changed (deep comparison)
@.1: Comparar a versão anterior dos hooks e proops
@.2: SE mudou algo, ele vai permitir a nova renderização
*/

const seachFormSchema = z.object({
  query: z.string(),
})

type SearchFormInputs = z.infer<typeof seachFormSchema>

function SeachFormComponent() {
  const fetchTransactions = useContextSelector(
    TransactionsContext,
    (context) => {
      return context.fetchTransactions
    },
  )

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SearchFormInputs>({
    resolver: zodResolver(seachFormSchema),
  })

  async function handleSearchTransactions(data: SearchFormInputs) {
    await fetchTransactions(data.query)
  }

  return (
    <SearchFormContainer onSubmit={handleSubmit(handleSearchTransactions)}>
      <input
        type="text"
        placeholder="Busque por transações"
        {...register('query')}
      />

      <button type="submit" disabled={isSubmitting}>
        <MagnifyingGlass size={20} />
        Buscar
      </button>
    </SearchFormContainer>
  )
}

export const SearchForm = memo(SeachFormComponent)
