export default async function TempSearch() {
  let itemQuery = "persian";
  const respData = await fetch(
    `${process.env.NEXT_PUBLIC_PROD_URL}/api/GenreResearch?queryItem=${itemQuery}`
  );

  let data = await respData.json();
  //console.log(data);
  return "TMP";
}
