// pages/index.tsx

import {
  useLoadScript,
  GoogleMap,
  MarkerF,
  InfoWindow,
  Marker,
  InfoWindowF,
  DirectionsService,
  DirectionsRenderer,
} from "@react-google-maps/api";
import type { NextPage } from "next";
import { useEffect, useMemo, useState } from "react";
import { signIn, useSession, signOut, getSession } from "next-auth/react";
import { decode, getToken } from "next-auth/jwt";

type Myco = {
  lat: number;
  lng: number;
};

export async function getServerSideProps(context: any) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/signin",
      },
    };
  }

  if (!session.pea) {
    return {
      redirect: {
        destination: "/profile",
      },
    };
  }
  return {
    props: {},
  };
}

const Home: NextPage = () => {
  const [activeMarker, setActiveMarker] = useState(true);
  const [myco, setMyco] = useState<null | Myco>(null);
  //const [directionsResponse, setDirectionsResponse] = useState<google.maps.DirectionsResult|null>(null)

  const libraries = useMemo(() => ["places"], []);
  const mapCenter = useMemo(
    () => ({ lat: 27.672932021393862, lng: 85.31184012689732 }),
    []
  );

  const mapOptions = useMemo<google.maps.MapOptions>(
    () => ({
      disableDefaultUI: true,
      clickableIcons: true,
      scrollwheel: true,
    }),
    []
  );

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY as string,
    libraries: libraries as any,
  });

  if (!isLoaded) {
    return <p>Loading...</p>;
  }

  //สร้างเส้นทางบนแผนที่ google map
  // const calculateRoute = async()=>{
  //   const directionsService = new google.maps.DirectionsService()
  // const results = await directionsService.route({
  //   origin: "27.672932021393862,85.31184012689732",
  //   destination: "27.670719, 85.320251",
  //   // eslint-disable-next-line no-undef
  //   travelMode: google.maps.TravelMode.DRIVING,
  // })
  // setDirectionsResponse(results)
  // }

  // calculateRoute()

  return (
    <div className="flex flex-col">
      <div className="flex justify-center ">
        <p>This is Sidebar...</p>
      </div>
      <div className="flex justify-center ">
        <button
          onClick={() => signIn("google")}
          type="button"
          className="btn btn-primary"
        >
          Sign In with Google
        </button>
      </div>
      <div className="flex justify-center ">
        <button
          onClick={() => signIn("line")}
          type="button"
          className="btn btn-primary"
        >
          Sign In with Line
        </button>
      </div>
      <div className="flex justify-center ">
        <button
          onClick={() => {
            signOut({ redirect: false });
          }}
          type="button"
          className="btn btn-primary"
        >
          Sign Out
        </button>
      </div>

      <div className="flex justify-center">
        <GoogleMap
          onClick={(e) => {
            if (e.latLng == null) {
              console.log("no coordinate");
            } else {
              setMyco({ lat: e.latLng.lat(), lng: e.latLng.lng() });
            }
          }}
          options={mapOptions}
          zoom={14}
          center={mapCenter}
          mapTypeId={google.maps.MapTypeId.ROADMAP}
          mapContainerStyle={{ width: "800px", height: "800px" }}
          onLoad={() => console.log("Map Component Loaded...")}
        >
          <MarkerF
            icon={"http://maps.google.com/mapfiles/ms/icons/green.png"}
            position={mapCenter}
            onClick={() => setActiveMarker(true)}
            onLoad={() => console.log("Marker Loaded")}
          >
            {activeMarker ? (
              <InfoWindowF
                zIndex={10}
                onCloseClick={() => setActiveMarker(false)}
                onLoad={() => console.log("load info window")}
                position={mapCenter}
              >
                <div>
                  <h1>InfoWindow</h1>
                </div>
              </InfoWindowF>
            ) : undefined}
          </MarkerF>
          {myco == null ? undefined : (
            <MarkerF
              icon={"http://maps.google.com/mapfiles/ms/icons/red.png"}
              position={myco}
            />
          )}
          {/*สร้างเส้นทางบนแผนที่ {directionsResponse && (
            <DirectionsRenderer directions={directionsResponse} />
          )} */}
        </GoogleMap>
      </div>
    </div>
  );
};

export default Home;
