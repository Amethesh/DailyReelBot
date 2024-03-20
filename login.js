import fs from "fs";

//Use it for in Local file read
// let file = fs.readFileSync("../json/cookies.json", "utf8");
let file = false;

console.log(file);
if (!file) {
  console.log("No cookies found Logining");
  //Login to the instagram
  await page.waitForSelector("input[name=username]");

  await page.type("input[name=username]", process.env.INSTA_USERNAME);
  await page.type("input[name=password]", process.env.INSTA_PASSWORD);

  await page.click("button[type=submit]");

  //Saving cookies
  const newCookies = await page.cookies();
  //console.log(cookies)
  fs.writeFile("cookies.json", JSON.stringify(newCookies), (err) => {
    if (err) console.log("Unable to write");
    else console.log("Cookies written successfully");
  });
  //clicks needed to get to home page
  await page.waitForSelector("._ac8f button[type=button]");
  await page.click("._ac8f button[type=button]");
}
