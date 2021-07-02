export default async function TempSearch() {
  let itemQuery = [];

  for (let i = 0; i < itemQuery.length; i++) {
    const respData = await fetch(
      `${process.env.NEXT_PUBLIC_PROD_URL}/api/GenreResearch?queryItem=${itemQuery[i]}`
    );

    let data = await respData.json();
    // console.log(data);
  }
  return "TMP";
}
