import Phoenix from "phoenix-server-js";

const PHOENIX_TOKEN = `${process.env.PHOENIX_TOKEN}`;
const PHOENIX_HOST = `${process.env.PHOENIX_HOST}`;

const initPhoenix = async () => {
  try {
    const phoenix = new Phoenix({
      token: PHOENIX_TOKEN,
      host: PHOENIX_HOST,
    });

    return phoenix;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export { initPhoenix };
