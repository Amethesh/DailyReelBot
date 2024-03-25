import puppeteer from "puppeteer";
import fs from "fs";
import * as dotenv from "dotenv";

dotenv.config();

const url = "https://www.instagram.com/";
const filePath = process.env.DAY_PATH;
const reelPath = process.env.REEL_PATH;
const cookiesPath = process.env.COOKIES_PATH;
const wait = (ms) => new Promise((res) => setTimeout(res, ms));

// Function to read the number from the text file
async function readNumberFromFile(filePath) {
    try {
        const data = await fs.readFileSync(filePath, 'utf8');
        return parseInt(data.trim());
    } catch (error) {
        console.error("Error reading file:", error);
        return null;
    }
}

// Function to write the number to the text file
async function writeNumberToFile(filePath, number) {
    try {
        await fs.writeFileSync(filePath, number.toString());
    } catch (error) {
        console.error("Error writing file:", error);
    }
}

const dailyBot = async () => {
  const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.goto(url);
  console.log("Opening");
  await wait(2000);
  await page.screenshot({ path: "test.png" });

  //!Login function
  let file = fs.readFileSync(cookiesPath, "utf8");
  let cookies;
  if (!file) {
    //Login to the instagram
    await page.waitForSelector("input[name=username]");

    await page.type("input[name=username]", process.env.INSTA_USERNAME);
    await page.type("input[name=password]", process.env.INSTA_PASSWORD);

    await page.click("button[type=submit]");

    //Saving cookies
    cookies = await page.cookies();
    //console.log(cookies)
    fs.writeFileSync("json/cookies.json", JSON.stringify(cookies), (err) => {
      if (err) console.log("Unable to write");
      else console.log("Cookies written successfully");
    });
    //clicks needed to get to home page
    await page.waitForSelector("._ac8f button[type=button]");
    await page.click("._ac8f button[type=button]");
  } else {
    cookies = JSON.parse(file);
    //Load cookies
    // const cookies = JSON.parse(cookiesString);
    await page.setCookie(...cookies);
    console.log(cookies);
    console.log("Loaded cookies👍");
    // await page.reload({ waitUntil: "networkidle2" });
    await page.goto(url, { waitUntil: "domcontentloaded" });
  }
  //!Login function end

  await page.waitForSelector("._a9-z ._a9--._a9_1");
  await page.click("._a9-z ._a9--._a9_1");

  //Clicking create button
  await page.waitForSelector(".xh8yej3.x1iyjqo2");
  await page.click(".xh8yej3.x1iyjqo2 div:nth-child(7)");
  console.log("clicked add post");

  // opening the file chooser
  await page.waitForSelector("._acap");
  // await page.click("._acap");
  // console.log("Waited and got the DOM");

  //Choosing reel

  const [fileChooser] = await Promise.all([
    page.waitForFileChooser(),
    page.click("._acap"), // some button that triggers file selection
  ]);
  const reelpath = reelPath;
  await fileChooser.accept([reelpath]);
  console.log("Files accepted");

  //Clicking OK in diaglog box
  await page.waitForSelector("._acan._acap._acaq._acas._acav._aj1-._ap30");
  await page.click("._acan._acap._acaq._acas._acav._aj1-._ap30");

  //Setting to original size
  await page.waitForSelector('[aria-label="Select crop"]');
  await page.click('[aria-label="Select crop"]');
  console.log("Waited and clicked crop");

  await page.waitForSelector(
    ".x9f619.xjbqb8w.x78zum5.x168nmei.x13lgxp2.x5pf9jr.xo71vjh.x16n37ib.x150jy0e.x1e558r4.x1n2onr6.x1plvlek.xryxfnj.x1iyjqo2.x2lwn1j.xeuugli.x1q0g3np.xqjyukv.x6s0dn4.x1oa3qoh.x1nhvcw1"
  );
  await page.click(
    `.x9f619.xjbqb8w.x78zum5.x168nmei.x13lgxp2.x5pf9jr.xo71vjh.x16n37ib.x150jy0e.x1e558r4.x1n2onr6.x1plvlek.xryxfnj.x1iyjqo2.x2lwn1j.xeuugli.x1q0g3np.xqjyukv.x6s0dn4.x1oa3qoh.x1nhvcw1`
  );
  console.log("Image Size selected");

  //Clicking Next
  await page.waitForSelector(
    ".x9f619.xjbqb8w.x78zum5.x168nmei.x13lgxp2.x5pf9jr.xo71vjh.xyamay9"
  );
  await page.click(
    ".x9f619.xjbqb8w.x78zum5.x168nmei.x13lgxp2.x5pf9jr.xo71vjh.xyamay9"
  );

  await wait(1000);
  await page.click(
    ".x9f619.xjbqb8w.x78zum5.x168nmei.x13lgxp2.x5pf9jr.xo71vjh.xyamay9"
  );

  await page.waitForSelector('[aria-label="Write a caption..."]');
  console.log("Found and waited for caption dom");

  let number = await readNumberFromFile(filePath);

  const caption = `Day ${number} of I am Atomic⚛️

                    𝙏𝙖𝙜𝙨 🏷️
                    #animeworld #animefan #animeedit #animeedits 
                    #animeboy #animes #animefans`;

  await page.type('[aria-label="Write a caption..."]', `${caption}`);

  number++

  await writeNumberToFile(filePath, number);

  await wait(1000);
  await page.click("._ac7b._ac7d");
  await page.waitForSelector('img[alt="Animated checkmark"]');
  await browser.close();
  console.log("posted 👍");
};

dailyBot();
