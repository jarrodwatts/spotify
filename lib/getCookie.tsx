const getCookie = (name: String): String | undefined => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts && parts.length === 2) {
    return parts.pop().split(";").shift();
  } else {
    return undefined;
  }
};

export default getCookie;
