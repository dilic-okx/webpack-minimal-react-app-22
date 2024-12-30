import React, { useEffect, useState } from "react";
import api from "../../lib/api";

type Item = {
  label: string;
  domain?: string;
  link: string;
  linkText?: string;
  urlPrefix?: string;
  ts?: string;
  tsProc?: (ts: string) => string;
  ln?: number;
  source?: string;
  bg?: string;
  clip?: string[];
  slider?: string[];
  skipIfContains?: string;
};

type InfoScrap = {
  url: string;
  label: string;
  target?: string;
  item: Item;
  skip?: boolean;
  debug?: boolean;
  posterPrefix?: string;
};

interface InfoScraperProps {
  scraps: InfoScrap[];
  apiInstance?: any;
}

(String.prototype as any).format = function () {
  let formatted = this;
  for (let i = 0; i < arguments.length; i++) {
    let regexp = new RegExp("\\{" + i + "\\}", "gi");
    formatted = formatted.replace(regexp, arguments[i]);
  }
  return formatted;
};

const InfoScraper: React.FC = (props: InfoScraperProps) => {
  const { scraps, apiInstance: propsInstance } = props;
  if (!scraps) return;
  console.log(`---scraps`, scraps);

  const apiInstance = propsInstance || api.createAxiosInstance();

  const [currentScrap, setCurrentScrap] = useState(scraps[0]);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  let [data, setData] = useState([]);

  let sliderTimeout: any;

  const getDomain = (url: string) => {
    if (url.includes("//")) {
      return url.split("//")[1].split("/")[0].replace("www.", "");
    }
    return url.split("/")[0].replace("www.", "");
  };

  const timeStringToSeconds = (timeString: string) => {
    let seconds = 0;
    if (timeString.includes(":")) {
      const arr = timeString.split(":");
      let s = 1;
      while (arr.length > 0) {
        const val = arr.pop().trim();
        const inc = parseInt(val, 10);
        seconds += s * inc;
        s *= 60;
      }
    } else if (timeString.includes("min") || timeString.includes("sec")) {
      let arr = timeString
        .replace("hours", "h")
        .replace("hour", "h")
        .replace("hr", "h")
        .replace("minute", "m")
        .replace("min", "m")
        .replace("seconds", "s")
        .replace("second", "s")
        .replace("sec", "s")
        .split("h");

      seconds +=
        arr[1] || arr[1] === "" ? parseInt(arr.shift().trim(), 10) * 3600 : 0;

      arr = arr[0].split("m");
      seconds +=
        arr[1] || arr[1] === "" ? parseInt(arr.shift().trim(), 10) * 60 : 0;

      seconds += arr[0] ? parseInt(arr[0].replace("s", "").trim(), 10) : 0;
    } else {
      console.log(`--UNKNOWN TS!!!`, timeString);
    }
    return seconds;
  };

  const formatSeconds = (seconds: number): string => {
    let rest = seconds;
    let formatted = "";
    let hr: number = 0;
    let min: number = 0;
    if (rest > 3600) {
      hr = Math.floor(rest / 3600);
      rest = rest - hr * 3600;
      formatted += `${hr < 10 ? "0" + hr : hr}:`;
    }
    if (rest > 60) {
      min = Math.floor(rest / 60);
      rest = rest - min * 60;
      formatted += `${min < 10 ? "0" + min : min}:`;
    } else {
      formatted += `00:`;
    }
    formatted += `${rest < 10 ? "0" + rest : rest}`;
    return formatted;
  };

  const processScrap = async (scrap: any): Promise<any[]> => {
    const res = await apiInstance({
      method: "get",
      url: "/tools/scraper/" + encodeURIComponent(scrap.url),
      responseType: "document",
    });
    const items = [];
    if (!res.data) {
      console.log(`----- NO DATA`, scrap.url, res);
      return [];
    }
    for (const node of res.data.body.querySelectorAll(scrap.target)) {
      let poster: string;
      let ts: string;
      let ln: number = 0;
      let source: string;
      let label: string;

      if (
        scrap.thumb?.skipIfContains &&
        node.querySelector(scrap.thumb.skipIfContains)
      ) {
        continue;
      }

      const imgs = node.querySelectorAll("img");
      const links = node.querySelectorAll("a");

      if (scrap?.thumb?.ts) {
        const tsNode = node.querySelector(scrap.thumb.ts);
        ts = (tsNode?.innerText || tsNode?.innerHTML || "--").toLowerCase();
        if (ts == "--") {
          continue;
        }
        if (scrap.thumb.tsProc) {
          ts = scrap.thumb.tsProc(tsNode?.innerHTML?.toLowerCase() || ts);
        }
        ln = timeStringToSeconds(ts);
        if (!ln || ln < 10) {
          continue;
        }
      }
      if (scrap?.thumb?.label) {
        const labelNode = node.querySelector(scrap.thumb.label);
        label = labelNode?.innerText || labelNode?.innerHTML || "--";
      }
      if (scrap?.thumb?.source) {
        const sourceNode = node.querySelector(scrap.thumb.source);
        source = sourceNode?.innerText || sourceNode?.innerHTML || "--";
      }
      for (const img of imgs) {
        if (img.hasAttribute("data-src")) {
          img.setAttribute("src", img.getAttribute("data-src"));
        }
        if (img.hasAttribute("data-original")) {
          img.setAttribute("src", img.getAttribute("data-original"));
        }
      }
      let imgLink: string | undefined;
      let linkText: string | undefined;
      for (const link of links) {
        if (scrap?.thumb?.urlPrefix) {
          link.setAttribute(
            "href",
            scrap.thumb.urlPrefix + link.getAttribute("href")
          );
        }
        const linkImg = link.querySelector("img");
        if (linkImg) {
          imgLink = link.getAttribute("href");
          poster = linkImg.getAttribute("src");
        } else if (!linkText) {
          linkText = link.innerText || link.innerHTML;
        }
      }
      const posterUrl = poster || imgs[0]?.getAttribute("src");
      let videoProp = {};
      if (scrap?.thumb?.video && posterUrl) {
        const { urlPattern, urlParams, urlTarget, urlAttribute } =
          scrap.thumb.video;
        if (urlPattern) {
          const params = [];
          for (const urlCallback of urlParams) {
            params.push(urlCallback(posterUrl));
          }
          videoProp = { video: urlPattern.format(...params) };
        }
        if (urlTarget) {
          videoProp = {
            video: node.querySelector(urlTarget)?.getAttribute(urlAttribute),
          };
        }
      }
      let sliderProp = {};
      if (scrap?.thumb?.slider && posterUrl) {
        const { urlPattern, urlParams } = scrap.thumb.slider;
        const params = [];
        for (const urlCallback of urlParams) {
          params.push(urlCallback(posterUrl));
        }
        const slider = [];
        const limit = scrap.thumb.slider.limit || 10;
        for (let i = 1; i <= limit; i++) {
          slider.push(urlPattern.format(...params).replace(/\{c\}/gi, i));
        }
        if (scrap.thumb.slider.pushPoster) {
          slider.push(posterUrl);
        }
        sliderProp = { slider };
      }
      let clipProp = {};
      if (imgs.length > 1) {
        const frames = [];
        for (const img of imgs) {
          frames.push(img.getAttribute("src"));
        }
        clipProp = { clip: frames };
      }

      items.push({
        link: imgLink || links[0]?.getAttribute("href"),
        linkText: label || linkText || "--",
        ts,
        ln,
        source,
        domain: getDomain(scrap.search.urlPattern),
        bg: `url('${(scrap.posterPrefix || "") + posterUrl}')`,
        ...clipProp,
        ...videoProp,
        ...sliderProp,
      });
    }
    return items;
  };

  const handleScraper = async () => {
    const res = await apiInstance({
      method: "get",
      url: "/tools/scraper/" + encodeURIComponent(currentScrap.url),
      responseType: "document",
    });
    const scrapPanel = document.querySelector(".scraper .scraper-panel");
    if (res.data && !res.data.body.innerHTML) {
      console.log(`--resp`, res.data);
    }
    console.log(`--scrapPanel`, scrapPanel, res.data);
    if (scrapPanel) {
      if (currentScrap?.target) {
        const items = [];
        for (const node of res.data.body.querySelectorAll(
          currentScrap.target
        )) {
          let poster: string;
          let ts: string;
          let source: string;
          let label: string;

          const imgs = node.querySelectorAll("img");
          const links = node.querySelectorAll("a");

          if (currentScrap?.thumb?.ts) {
            const tsNode = node.querySelector(currentScrap.thumb.ts);
            ts = tsNode?.innerText || tsNode?.innerHTML || "--";
          }
          if (currentScrap?.thumb?.label) {
            const labelNode = node.querySelector(currentScrap.thumb.label);
            label = labelNode?.innerText || labelNode?.innerHTML || "--";
          }
          if (currentScrap?.thumb?.source) {
            const sourceNode = node.querySelector(currentScrap.thumb.source);
            source = sourceNode?.innerText || sourceNode?.innerHTML || "--";
          }
          for (const img of imgs) {
            if (img.hasAttribute("data-src")) {
              img.setAttribute("src", img.getAttribute("data-src"));
            }
            if (img.hasAttribute("data-original")) {
              img.setAttribute("src", img.getAttribute("data-original"));
            }
          }
          let imgLink: string | undefined;
          let linkText: string | undefined;
          for (const link of links) {
            if (currentScrap?.thumb?.urlPrefix) {
              link.setAttribute(
                "href",
                currentScrap.thumb.urlPrefix + link.getAttribute("href")
              );
            }
            const linkImg = link.querySelector("img");
            if (linkImg) {
              imgLink = link.getAttribute("href");
              poster = linkImg.getAttribute("src");
            } else if (!linkText) {
              linkText = link.innerText || link.innerHTML;
            }
          }
          const posterUrl = poster || imgs[0]?.getAttribute("src");
          let videoProp = {};
          if (currentScrap?.thumb?.video && posterUrl) {
            const { urlPattern, urlParams, urlTarget, urlAttribute } =
              currentScrap.thumb.video;
            if (urlPattern) {
              const params = [];
              for (const urlCallback of urlParams) {
                params.push(urlCallback(posterUrl));
              }
              videoProp = { video: urlPattern.format(...params) };
            }
            if (urlTarget) {
              videoProp = {
                video: node.querySelector(urlTarget).getAttribute(urlAttribute),
              };
            }
          }
          let sliderProp = {};
          if (currentScrap?.thumb?.slider && posterUrl) {
            const { urlPattern, urlParams } = currentScrap.thumb.slider;
            const params = [];
            for (const urlCallback of urlParams) {
              params.push(urlCallback(posterUrl));
            }
            const slider = [];
            const limit = currentScrap.thumb.slider.limit || 10;
            for (let i = 1; i <= limit; i++) {
              slider.push(urlPattern.format(...params).replace(/\{c\}/gi, i));
            }
            if (currentScrap.thumb.slider.pushPoster) {
              slider.push(posterUrl);
            }
            sliderProp = { slider };
          }
          let clipProp = {};
          if (imgs.length > 1) {
            const frames = [];
            for (const img of imgs) {
              frames.push(img.getAttribute("src"));
            }
            clipProp = { clip: frames };
          }

          items.push({
            link: imgLink || links[0]?.getAttribute("href"),
            linkText: label || linkText || "--",
            ts,
            source,
            bg: `url('${posterUrl}')`,
            ...clipProp,
            ...videoProp,
            ...sliderProp,
          });
        }
        setItems(items);
      } else {
        scrapPanel.innerHTML = res.data.body.innerHTML;
      }
    }
  };

  useEffect(() => {
    const handleResize = () => {
      const itms = document.querySelectorAll(`.scraper-thumb`);
      const winW = window.innerWidth;
      const winH = window.innerHeight;
      for (const itm of itms) {
        const w = (itm as any).offsetWidth;
        const h = (itm as any).offsetHeight;
        const { left, top } = itm.getBoundingClientRect();
        let originL = "center";
        let originT = "center";
        if (left + w / 2 < winW / 6) {
          originL = "left";
        }
        if (left + w / 2 > (winW / 6) * 5) {
          originL = "right";
        }
        if (top + h / 2 < winH / 3) {
          originT = "top";
        }
        if (top + h / 2 > (winH / 3) * 2) {
          originT = "bottom";
        }
        (itm as any).style.transformOrigin = `${originL} ${originT}`;
      }
    };
    handleResize();
    window.removeEventListener("resize", handleResize);
    window.addEventListener("resize", handleResize);
    document
      .querySelector(`.main-content`)
      .removeEventListener("scroll", handleResize);
    document
      .querySelector(`.main-content`)
      .addEventListener("scroll", handleResize);
  });

  useEffect(() => {
    if (!items.length) {
      handleScraper();
    }
  }, []);
  return (
    <div className="scraper">
      <div className="scraper-panel" />
      <div className="thumbs-panel">
        {items?.map((item: Item, i: number) => (
          <div key={`scth-${i}`} className="scraper-thumb">
            <a href={item.link} target="_blank">
              <div
                className="scraper-thumb-img"
                style={{ backgroundImage: item.bg }}
              >
                {item.slider && (
                  <div
                    className="slider"
                    onMouseOver={(e) => {
                      sliderTimeout = setTimeout(() => {
                        e.target.parentNode.insertBefore(
                          e.target,
                          e.target.parentNode.children[0]
                        );
                      }, 700);
                    }}
                    onMouseOut={() => clearTimeout(sliderTimeout)}
                  >
                    {item.slider.map((slide, i) => (
                      <img
                        src={slide}
                        key={"slide-" + i}
                        onError={(e: any) => (e.target.style.display = "none")}
                      />
                    ))}
                  </div>
                )}
                {(item.source || item.domain) && (
                  <div className="scraper-thumb-source">
                    {item.source || item.domain}
                  </div>
                )}
                <div className="scraper-thumb-ts">{formatSeconds(item.ln)}</div>
              </div>
            </a>
            <div className="scraper-thumb-info">
              <a href={item.link} target="_blank">
                {item.linkText}
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InfoScraper;
