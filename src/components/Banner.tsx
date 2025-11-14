import { ContainerTextFlip } from "@/components/ui/container-text-flip";

export function Banner() {
  return (
    <div className=" bg-gray-500 h-[60vh] bg-cover bg-center bg-no-repeat w-full p-4 rounded-lg  
    text-center flex flex-col items-center justify-center"
    style={{ backgroundImage: "url('/bannerImg.jpg')" }}>
      <ContainerTextFlip
        words={["Play", "Upload", "Perfect"]}
        className="mx-auto"
      />
      <h1 className="text-white text-lg font-proximaBold rounded-lg">
        Let AI judge your performance with precision. Turn every take into your
        best one yet.
      </h1>
    </div>
  );
}
