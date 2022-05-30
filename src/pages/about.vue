<script setup lang="ts"></script>

<template>
  <h1 class="text-blog-700 dark:text-dark-repulser-400 px-4 lg:px-0">About me</h1>

  <div class="px-4 mt-4 lg:px-0">
    <p class="mb-4 text-gray-300">Welcome, I'm Zach.</p>

    <img src="/assets/me.png" class="profile" />

    <p class="mb-4 text-gray-300">
      I've worked with JavaScript & TypeScript & SQL - along with several other languages
      - and a number of its libraries and frameworks, for over half a decade and as my
      programming skills grow so does my passion and curiosity for containerization
      (docker and kubernetes) and cloud and database development, as well as data
      visualization. Professionally, I've been living in the headless CMS world and have
      taken a strong interest in structured content and the JamStack. I like to teach and
      demonstrate the knowledge I have gained during my time as a developer. I also like
      long single file components written in tsx within Vue 3.x and React Native repos and
      really fancy as many functional components I can write until I'm lost. I intend to
      learn Rust and/or C++ and work with embedded systems; I've read a lot of the docs
      and followed a few tutorials on the 2 lower-level languages but have not yet had the
      chance yet to truly delve into them.
    </p>

    <p class="mb-4 text-gray-300">
      I primarily code using Visual Studio, but over the past year or so I've been
      spending time with Vim/Neovim but I'm still not yet to the point where I'm a more
      efficient developer while using it. I know the basic commands like toggling the
      menu, switching between tabs and all the other basics but I've found the barrier to
      entry after the basics, such as configuring syntax, LSP and tree-sitters, to be a
      time-consuming drag so I'm still stuck in VS Code land indefinitely.
    </p>

    <p className="mb-4 text-gray-300">
      When I'm not learning and experimenting with the latest and greatest technologies,
      building sites with TypeScript, Node.js and GraphQL and Rest APIs, I'm usually
      either studying and completing coding challenges on sites like LeetCode, playing
      video games with some friends (my games of choice at the moment are: Star Wars:
      Fallen Order and MLB The Show), on the golf course ( I'm currently between a 6 and 4
      handicap ) working on my game, playing fantasy sports or spending time with my
      lovely wife, Alicia. I was also a published fiction writer many moons ago and hope
      to delve back into writing fiction one of these days but for now it's only
      non-fiction script tags for me. To learn more about me you can find my resume on
      <a
        href="https://www.linkedin.com/in/zach-edwards-905b105a/"
        className="font-bold transition-colors hover:text-sky-800"
        target="_blank"
        rel="noopener"
      >
        LinkedIn</a
      >
    </p>

    <div>
      <p class="mb-4 text-gray-300">Currently Reading:</p>
      <ul class="mb-4 text-gray-300">
        <li>The Lord of the Rings</li>
        <li>Dune</li>
        <li>Mastering WordPress Websites</li>
        <li>The Rust-lang Book</li>
        <li></li>
        <li></li>
      </ul>
    </div>
  </div>
</template>

<style>
.profile {
  max-width: 100px;
  max-height: 100px;
  border-radius: 50px;
  margin-bottom: 3rem;
}
</style>
