<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>Laravel</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">

        <!-- Styles / Scripts -->
        <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
    </head>
    <body class="flex justify-center items-center h-screen w-full relative overflow-hidden font-sans" style="background: url('https://job-order.smctgroup.ph/engine.jpg')">
      <div class="absolute inset-0 bg-black/80 z-0"></div>
      <section class="relative py-20 lg:py-32 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div class="container px-4 md:px-6">
          <div class="flex flex-col items-center space-y-8 text-center">
            <img
              src="https://job-order.smctgroup.ph/logo.png"
              alt="Company Logo"
              class="h-46 w-auto"
            />
            <div class="space-y-4 max-w-4xl">
              <h1 class="text-4xl font-bold tracking-tighter text-white sm:text-5xl md:text-6xl lg:text-7xl">
                SMCT Group of Companies <span class="text-primary  ">Job Order Form</span>
              </h1>
              <p class="mx-auto max-w-2xl text-white text-muted-foreground text-lg sm:text-xl">
                Manage vehicle repairs, customer details, and parts requests
                seamlessly with job order system for automotive service
                providers.
              </p>
            </div>
            <div class="flex flex-col sm:flex-row gap-4">
                <a
                  href="https://job-order.smctgroup.ph"
                  class="text-lg px-8 py-6 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-700"
                >
                  Get Started
                </a>
            </div>
          </div>
      </section>
    </div>

        @if (Route::has('login'))
            <div class="h-14.5 hidden lg:block"></div>
        @endif
    </body>
</html>
