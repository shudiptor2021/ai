const FreePlan = ({title} : {title: string}) => {
  return (
    <div className="w-full h-full flex justify-center ">
      <h2 className="text-lg sm:text-xl  xl:text-3xl mt-40 text-black/60 font-bold">
        You need premium plan to {title}
      </h2>
    </div>
  );
};

export default FreePlan;
