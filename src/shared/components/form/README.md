# 📝 Componentes de Formulário

Sistema completo de componentes de formulário padronizados, reutilizáveis e acessíveis para o projeto.

## 🎯 Características

- ✅ **TypeScript** com tipagem forte
- ✅ **Acessibilidade** completa (ARIA, labels, descrições)
- ✅ **React Hook Form** compatível (forwardRef)
- ✅ **Estados visuais** (default, error, success, disabled)
- ✅ **Tamanhos** configuráveis (sm, md, lg)
- ✅ **Consistência visual** em toda a aplicação
- ✅ **Fácil manutenção** com componente base compartilhado

## 📦 Componentes Disponíveis

### Inputs de Texto
- `TextInput` - Input de texto genérico
- `EmailInput` - Input de email com validação HTML5
- `PasswordInput` - Input de senha com toggle de visibilidade
- `NumberInput` - Input numérico com min/max/step

### Seleção e Texto Longo
- `Select` - Dropdown de seleção
- `TextArea` - Área de texto multilinha

### Escolha
- `Checkbox` - Checkbox simples
- `Radio` - Radio button individual
- `RadioGroup` - Grupo de radio buttons
- `Switch` - Toggle switch

## 🚀 Uso Básico

### Importação

```tsx
import {
  TextInput,
  EmailInput,
  PasswordInput,
  NumberInput,
  Select,
  TextArea,
  Checkbox,
  RadioGroup,
  Switch,
} from "@/shared/components/form";
```

### Exemplo Simples

```tsx
<TextInput
  label="Nome"
  placeholder="Digite seu nome"
  required
/>
```

### Com React Hook Form

```tsx
import { useForm } from "react-hook-form";
import { TextInput, Select } from "@/shared/components/form";

function MyForm() {
  const { register, formState: { errors } } = useForm();

  return (
    <form>
      <TextInput
        label="Email"
        required
        {...register("email")}
        error={errors.email?.message}
      />
      
      <Select
        label="País"
        options={[
          { value: "br", label: "Brasil" },
          { value: "us", label: "Estados Unidos" },
        ]}
        placeholder="Selecione um país"
        {...register("country")}
        error={errors.country?.message}
      />
    </form>
  );
}
```

## 📚 Exemplos por Componente

### TextInput

```tsx
// Básico
<TextInput
  label="Nome"
  name="name"
/>

// Com validação
<TextInput
  label="CPF"
  name="cpf"
  required
  error="CPF inválido"
  helperText="Digite apenas números"
/>

// Com React Hook Form
<TextInput
  label="Telefone"
  {...register("phone")}
  error={errors.phone?.message}
/>
```

### EmailInput

```tsx
<EmailInput
  label="E-mail"
  name="email"
  required
  error={errors.email?.message}
/>
```

### PasswordInput

```tsx
<PasswordInput
  label="Senha"
  name="password"
  required
  error={errors.password?.message}
/>
```

### NumberInput

```tsx
// Com limites
<NumberInput
  label="Idade"
  name="age"
  min={0}
  max={120}
  required
/>

// Com decimais
<NumberInput
  label="Preço"
  name="price"
  min={0}
  step={0.01}
  placeholder="0.00"
/>
```

### Select

```tsx
const options = [
  { value: "1", label: "Opção 1" },
  { value: "2", label: "Opção 2" },
  { value: "3", label: "Opção 3", disabled: true },
];

<Select
  label="Selecione uma opção"
  options={options}
  placeholder="Escolha..."
  required
  error={errors.option?.message}
  {...register("option")}
/>
```

### TextArea

```tsx
<TextArea
  label="Descrição"
  name="description"
  rows={4}
  placeholder="Digite uma descrição..."
  error={errors.description?.message}
/>
```

### Checkbox

```tsx
<Checkbox
  label="Aceito os termos e condições"
  name="terms"
  required
  error={errors.terms?.message}
  {...register("terms")}
/>
```

### RadioGroup

```tsx
const statusOptions = [
  { value: "active", label: "Ativo" },
  { value: "inactive", label: "Inativo" },
];

<RadioGroup
  label="Status"
  name="status"
  options={statusOptions}
  value={selectedStatus}
  onChange={setSelectedStatus}
  required
  error={errors.status?.message}
/>
```

### Switch

```tsx
<Switch
  label="Ativar notificações"
  name="notifications"
  checked={enabled}
  onChange={(e) => setEnabled(e.target.checked)}
/>
```

## 🎨 Personalização

### Tamanhos

```tsx
<TextInput label="Pequeno" size="sm" />
<TextInput label="Médio" size="md" /> {/* padrão */}
<TextInput label="Grande" size="lg" />
```

### Variantes

```tsx
<TextInput label="Padrão" variant="default" />
<TextInput label="Erro" variant="error" error="Campo obrigatório" />
<TextInput label="Sucesso" variant="success" />
```

### Classes Customizadas

```tsx
<TextInput
  label="Customizado"
  className="mb-4"
  inputClassName="font-mono"
/>
```

## 🔧 Props Comuns

Todos os componentes compartilham estas props base:

| Prop | Tipo | Descrição |
|------|------|-----------|
| `label` | `string` | Label do campo |
| `helperText` | `string` | Texto de ajuda abaixo do campo |
| `error` | `string` | Mensagem de erro (ativa estado de erro) |
| `required` | `boolean` | Se o campo é obrigatório |
| `disabled` | `boolean` | Se o campo está desabilitado |
| `size` | `"sm" \| "md" \| "lg"` | Tamanho do campo |
| `variant` | `"default" \| "error" \| "success"` | Variante visual |
| `id` | `string` | ID do campo (gerado automaticamente se não fornecido) |
| `name` | `string` | Nome do campo (para React Hook Form) |
| `className` | `string` | Classes CSS para o container |
| `inputClassName` | `string` | Classes CSS para o input |

## ♿ Acessibilidade

Todos os componentes seguem as melhores práticas de acessibilidade:

- ✅ Labels associados via `htmlFor` e `id`
- ✅ Atributos ARIA (`aria-invalid`, `aria-describedby`)
- ✅ Mensagens de erro com `role="alert"`
- ✅ Suporte a navegação por teclado
- ✅ Estados visuais claros para leitores de tela

## 🔄 Migração de Formulários Existentes

### Antes

```tsx
<div>
  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
    Nome *
  </label>
  <input
    id="name"
    type="text"
    {...register("name")}
    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
  {errors.name && (
    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
  )}
</div>
```

### Depois

```tsx
<TextInput
  label="Nome"
  required
  {...register("name")}
  error={errors.name?.message}
/>
```

## 🚀 Melhorias Futuras

- [ ] Integração com design system (tokens de cor, espaçamento)
- [ ] Suporte a temas (dark mode)
- [ ] Validação em tempo real
- [ ] Máscaras de input (CPF, telefone, etc.)
- [ ] Autocomplete/Combobox
- [ ] DatePicker e TimePicker
- [ ] Upload de arquivos
- [ ] Slider/Range
- [ ] Animações de transição

## 📝 Notas Técnicas

- Os componentes usam `forwardRef` para compatibilidade com React Hook Form
- IDs são gerados automaticamente usando `useId()` do React
- O componente `BaseInput` encapsula a lógica comum
- Utilitários em `utils.ts` centralizam classes CSS e helpers
- Tipos TypeScript garantem segurança em tempo de compilação

## 🤝 Contribuindo

Ao adicionar novos componentes de formulário:

1. Use `BaseInput` como base quando possível
2. Siga o padrão de tipos em `types.ts`
3. Adicione exemplos de uso no README
4. Garanta acessibilidade completa
5. Teste com React Hook Form

