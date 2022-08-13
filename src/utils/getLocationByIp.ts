import axios from "axios";

export const getCoordinatesByIP = async () => {
  try {
    const { data } = await axios.get("https://ipapi.co/json/");
    const lat = data.latitude;
    const lng = data.longitude;

    let phi = (90 - lat) * (Math.PI / 180);
    let theta = (lng + 180) * (Math.PI / 180);
    let x = -(1 * Math.sin(phi) * Math.cos(theta));
    let z = 1 * Math.sin(phi) * Math.sin(theta);
    let y = 1 * Math.cos(phi);

    return { x, y, z };
  } catch (error) {
    console.log(error);
  }
};
