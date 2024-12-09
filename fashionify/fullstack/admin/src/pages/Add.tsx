import { TokenProps } from "../types/interface";
import { assets } from "../assets/assets";
import {
  BACKEND_URL,
  Categories,
  Sizes,
  SubCategories,
} from "../common/constants";
import { useState } from "react";
import { cn } from "../lib/utils";
import { toast } from "react-toastify";
import axios from "axios";

const ImageUpload = ({
  id,
  image,
  setImage,
}: {
  id: string;
  image: File | boolean;
  setImage: React.Dispatch<React.SetStateAction<File | boolean>>;
}) => {
  return (
    <label htmlFor={id}>
      <img
        className="w-20"
        src={!image ? assets.upload_area : URL.createObjectURL(image as File)}
        alt="Uploaded Image Area"
      />
      <input
        onChange={(e) => {
          if (e.target.files) {
            setImage(e.target.files[0]);
          }
        }}
        type="file"
        id={id}
        hidden
      />
    </label>
  );
};

const Add = ({ token }: TokenProps) => {
  const [image1, setImage1] = useState<boolean | File>(false);
  const [image2, setImage2] = useState<boolean | File>(false);
  const [image3, setImage3] = useState<boolean | File>(false);
  const [image4, setImage4] = useState<boolean | File>(false);

  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState<string>(Categories.Men);
  const [subCategory, setSubCategory] = useState<string>(SubCategories.Topwear);
  const [bestseller, setBestseller] = useState<boolean>(false);
  const [sizes, setSizes] = useState<string[]>([]);

  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("bestseller", bestseller.toString());
      // we cannot directly send array through form data to the server.
      formData.append("sizes", JSON.stringify(sizes));

      if (image1 instanceof File) {
        formData.append("image1", image1);
      }
      if (image2 instanceof File) {
        formData.append("image2", image2);
      }
      if (image3 instanceof File) {
        formData.append("image3", image3);
      }
      if (image4 instanceof File) {
        formData.append("image4", image4);
      }

      const response = await axios.post(
        BACKEND_URL + "/api/product/add",
        formData,
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setName("");
        setDescription("");
        setImage1(false);
        setImage2(false);
        setImage3(false);
        setImage4(false);
        setPrice("");
      } else {
        toast.error(response.data.message);
      }
    } catch (error: unknown) {
      console.log(error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col w-full items-start gap-3"
    >
      <div>
        <p className="mb-2">Upload Image</p>
        <div className="flex gap-2">
          <ImageUpload id="image1" image={image1} setImage={setImage1} />
          <ImageUpload id="image2" image={image2} setImage={setImage2} />
          <ImageUpload id="image3" image={image3} setImage={setImage3} />
          <ImageUpload id="image4" image={image4} setImage={setImage4} />
        </div>
      </div>

      <div className="w-full">
        <p className="mb-2">Product name</p>
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          className="w-full max-w-[500px] px-3 py-2"
          type="text"
          placeholder="Type here"
          required
        />
      </div>
      <div className="w-full">
        <p className="mb-2">Product description</p>
        <textarea
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          className="w-full max-w-[500px] px-3 py-2"
          placeholder="Write content here"
          required
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
        <div>
          <p className="mb-2">Product category</p>
          <select
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2"
          >
            {Object.values(Categories).map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <p className="mb-2">Sub category</p>
          <select
            onChange={(e) => setSubCategory(e.target.value)}
            className="w-full px-3 py-2"
          >
            {Object.values(SubCategories).map((subCategory) => (
              <option key={subCategory} value={subCategory}>
                {subCategory}
              </option>
            ))}
          </select>
        </div>

        <div>
          <p className="mb-2">Product Price</p>
          <input
            onChange={(e) => setPrice(e.target.value)}
            value={price}
            className="w-full px-3 py-2 sm:w-[120px]"
            type="number"
            placeholder="25"
          />
        </div>
      </div>

      <div>
        <p className="mb-2">Product Sizes</p>
        <div className="flex gap-3">
          {Object.values(Sizes).map((currentSize) => (
            <div
              key={currentSize}
              onClick={() =>
                setSizes((prev) =>
                  prev.includes(currentSize)
                    ? prev.filter((item) => item !== currentSize)
                    : [...prev, currentSize]
                )
              }
            >
              <p
                className={cn(
                  sizes.includes(currentSize) ? "bg-pink-100" : "bg-slate-200",
                  "px-3 py-1 cursor-pointer"
                )}
              >
                {currentSize}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2 mt-2">
        <input
          onChange={() => setBestseller((prev) => !prev)}
          checked={bestseller}
          type="checkbox"
          id="bestseller"
        />
        <label className="cursor-pointer" htmlFor="bestseller">
          Add to bestseller
        </label>
      </div>

      <button type="submit" className="w-28 py-3 mt-4 bg-black text-white">
        ADD
      </button>
    </form>
  );
};

export default Add;
