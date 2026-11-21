import Image from 'next/image'

const pets = [
  {
    src: '/pets/chicken.webp',
    name: 'chicken',
    width: 95,
    height: 90,
    size: 'h-10',
  },
  {
    src: '/pets/snail.webp',
    name: 'snail',
    width: 100,
    height: 100,
    size: 'h-12',
  },
  {
    src: '/pets/white-dog.webp',
    name: 'dog',
    width: 140,
    height: 95,
    size: 'h-12',
  },
  {
    src: '/pets/brown-dog.webp',
    name: 'dog',
    width: 120,
    height: 85,
    size: 'h-8',
  },
  { src: '/pets/fox.webp', name: 'fox', width: 92, height: 75, size: 'h-12' },
  {
    src: '/pets/akita.webp',
    name: 'akita',
    width: 174,
    height: 115,
    size: 'h-12',
  },
  {
    src: '/pets/turtle.webp',
    name: 'turtle',
    width: 115,
    height: 90,
    size: 'h-12',
  },
]

export default function Pets() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-24 bottom-2 z-10 hidden h-16 overflow-hidden lg:block"
    >
      <div className="pet-procession">
        {pets.map((pet) => (
          <Image
            src={pet.src}
            alt=""
            width={pet.width}
            height={pet.height}
            unoptimized
            loading="lazy"
            className={`w-auto ${pet.size}`}
            key={pet.src}
          />
        ))}
      </div>
    </div>
  )
}
