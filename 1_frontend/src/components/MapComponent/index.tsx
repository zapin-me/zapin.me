import dynamic from "next/dynamic";

const MapComponent = dynamic(() => import("./_MapComponent"), {
  ssr: false,
});

const CreatePinMap = dynamic(() => import("./_CreatePinMap"), {
  ssr: false,
});

export { MapComponent, CreatePinMap };
