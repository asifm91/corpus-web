<script lang="ts">
  import { page } from "$app/stores";
</script>

<div class="min-h-screen flex items-center justify-center bg-base-100">
  <div class="text-center p-8">
    <h1 class="text-9xl font-bold text-primary mb-4">404</h1>
    <h2 class="text-3xl font-semibold mb-4">Page Not Found</h2>
    <p class="text-lg opacity-70 mb-8">
      The page you're looking for doesn't exist or has been moved.
    </p>
    <div class="space-y-4">
      <p class="text-sm opacity-50">
        Requested URL: {$page.url.pathname}
      </p>
      <a href="/" class="btn btn-primary"> Return to Home </a>
    </div>
  </div>
</div>
