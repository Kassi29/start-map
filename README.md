# ✨ Celestial Moments

A high-performance interactive star map built with **Angular 17** that renders real-time celestial coordinates based on specific historical milestones.

## 🚀 Overview

This project visualizes the night sky (stars, planets, and galaxies) for any given date and location. It's designed with a "Mobile-First" approach, ensuring smooth 120Hz animations on high-end devices like the Samsung S23.

## 🛠️ Tech Stack

* **Framework:** Angular 17+ (utilizing new `@if` / `@for` control flow).
* **Styling:** SCSS with GPU-acceleration.
* **Data:** `astronomy-engine` for precise celestial positioning.
* **Deployment:** Vercel.

## ⚡ Performance Features

To achieve a "buttery smooth" experience on mobile browsers, the following was implemented:

* **GPU Offloading:** Used `will-change` properties to trigger hardware acceleration.
* **SVG Optimization:** Applied `shape-rendering: optimizeSpeed` to maintain high FPS during transitions.
* **Targeted Transitions:** Optimized SCSS to avoid layout thrashing by targeting specific properties instead of `all`.

## 🔧 Installation & Setup

1. **Clone the project:**
```bash
git clone https://github.com/Kassi29/start-map.git

```


2. **Install dependencies:**
```bash
npm install

```


3. **Run locally:**
```bash
ng serve

```
