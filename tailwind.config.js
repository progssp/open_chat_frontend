/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage:{
        'icon':'url("http://localhost:3000/user_images/profile_pictures/profile.webp")' 
      }
    },
  },
  plugins: [],
}

