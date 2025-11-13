import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IoIosSearch } from "react-icons/io";
import { IoIosAdd } from "react-icons/io";
export default function Header() {
  return (
    <div className="flex w-full flex flex-row justify-between items-center gap-2 p-4">
      <div className="flex flex-row items-center justify-center gap-8">
        <h1 className="font-proximaBold text-white text-lg">Pick Perfect</h1>
        <div className="bg-white rounded-lg flex flex-row items-center justify-center">
          <Input
            type="email"
            placeholder="Search"
            className="border text-gray-500 border-white bg-white "
          />
          <Button
            type="submit"
            variant="outline"
            className="border border-white bg-white text-gray-500  cursor-pointer"
          >
            <IoIosSearch />
          </Button>
        </div>
      </div>
      <div className="bg-white border rounded-lg cursor-pointer flex flex-row items-center justify-center pl-2">
        <h6 className=" text-gray-500 border-white  ">Add</h6>
        <Button type="submit" className="  text-gray-500  cursor-pointer">
          <IoIosAdd />
        </Button>
      </div>
    </div>
  );
}
