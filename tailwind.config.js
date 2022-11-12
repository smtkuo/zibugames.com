/** @type {import('tailwindcss').Config} */
module.exports = {
  content: 
  [
    "./views/layouts/*/*.ejs",
    "./controllers/*.js",
    "./views/components/*.ejs",
    "./views/pages/*.ejs",
    "./views/*.ejs",
    "./lib/components/*.js",
  ],
  plugins: [require('daisyui')],
}