import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { IOptions, RecursivePartial } from "@tsparticles/engine";

const DarkThemeParticles = () => {
  const [engineReady, setEngineReady] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setEngineReady(true));
  }, []);

  const options = useMemo<RecursivePartial<IOptions>>(() => ({
    fullScreen: {
      enable: true,
      zIndex: 1
    },
    background: {
      color: "transparent"
    },
    fpsLimit: 120,
    interactivity: {
      events: {
        onClick: {
          enable: true,
          mode: ["push", "attract"]
        },
        onHover: {
          enable: true,
          mode: ["grab", "bubble", "repulse"],
          parallax: {
            enable: true,
            force: 60,
            smooth: 10
          }
        },
        resize: {
          enable: true
        }
      },
      modes: {
        grab: {
          distance: 200,
          links: {
            opacity: 0.2
          }
        },
        bubble: {
          distance: 180,
          duration: 2,
          size: 6,
          opacity: 0.8
        },
        repulse: {
          distance: 160,
          duration: 0.4
        },
        attract: {
          distance: 400,
          duration: 0.4,
          factor: 5,
          speed: 1,
          maxSpeed: 50,
          easing: "ease-out-quad"
        },
        push: {
          quantity: 4
        }
      }
    },
    particles: {
      color: {
        value: [
          "#E6E6FA", // Lavender
          "#B0C4DE", // LightSteelBlue
          "#87CEEB", // SkyBlue
          "#F0F8FF", // AliceBlue
          "#FFFFFF"  // White
        ]
      },
      links: {
        color: "#304352",
        distance: 150,
        enable: true,
        opacity: 0.2,
        width: 1
      },
      collisions: {
        enable: false
      },
      move: {
        direction: "none",
        enable: true,
        outModes: {
          default: "bounce"
        },
        random: true,
        speed: 1,
        straight: false,
        attract: {
          enable: true,
          rotate: {
            x: 600,
            y: 1200
          }
        }
      },
      number: {
        density: {
          enable: true,
          width: 1920,
          height: 1080
        },
        value: 100
      },
      opacity: {
        value: {
          min: 0.1,
          max: 0.5
        },
        animation: {
          enable: true,
          speed: 0.5
        }
      },
      shape: {
        type: "circle"
      },
      size: {
        value: { min: 1, max: 3 },
        animation: {
          enable: true,
          speed: 2,
          sync: false
        }
      },
      twinkle: {
        particles: {
          enable: true,
          color: "#ffffff",
          frequency: 0.05,
          opacity: 1
        },
        lines: {
          enable: true,
          frequency: 0.005,
          opacity: 1
        }
      }
    },
    detectRetina: true
  }), []);

  if (!engineReady) return null;

  return (
    <Particles
      id="tsparticles-dark"
      options={options}
    />
  );
};

export default DarkThemeParticles;