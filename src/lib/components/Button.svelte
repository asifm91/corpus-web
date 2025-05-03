<script lang="ts">
  export let type: "button" | "submit" | "reset" = "button";
  export let variant: "primary" | "secondary" | "danger" | "success" =
    "primary";
  export let size: "sm" | "md" | "lg" = "md";
  export let disabled = false;
  export let fullWidth = false;
  export let onClick: () => void = () => {};
  export let className = "";
  export let dataAos: string | undefined = undefined;
  export let dataAosDelay: string | undefined = undefined;
</script>

<button
  {type}
  on:click={onClick}
  {disabled}
  class="rounded-md font-medium transition-colors duration-200
        {variant === 'primary'
    ? 'bg-blue-600 hover:bg-blue-700 text-white'
    : ''}
        {variant === 'secondary'
    ? 'bg-gray-200 hover:bg-gray-300 text-gray-800'
    : ''}
        {variant === 'danger' ? 'bg-red-600 hover:bg-red-700 text-white' : ''}
        {variant === 'success'
    ? 'bg-green-600 hover:bg-green-700 text-white'
    : ''}
        {size === 'sm' ? 'px-3 py-1.5 text-sm' : ''}
        {size === 'md' ? 'px-4 py-2 text-base' : ''}
        {size === 'lg' ? 'px-6 py-3 text-lg' : ''}
        {fullWidth ? 'w-full' : ''}
        {disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        {className}"
  data-aos={dataAos}
  data-aos-delay={dataAosDelay}
>
  <slot />
</button>
