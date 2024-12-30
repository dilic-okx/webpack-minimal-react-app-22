import React, { useEffect, useState } from 'react'
import Textfield from '../../components/textfield'
import Button from '../../components/button'
import Select, { Option } from '../../components/select'
import TabBar, { Tab } from '../../components/tab-bar'
import Checkbox from '../../components/checkbox'
import Radio from '../../components/radio'
import api from '../../lib/api'

import './index.css'

type Video = {
  urlPattern?: string
  urlParams?: { (url: string): string }[]
  urlTarget?: string
  urlAttribute?: string
}

type Thumb = {
  domain?: string
  link: string
  linkText?: string
  urlPrefix?: string
  ts?: string
  tsProc?: (ts: string) => string
  ln?: number
  source?: string
  bg?: string
  clip?: string[]
  slider?: string[]
  video?: Video
  skipIfContains?: string
}

type Scrap = {
  url: string
  target?: string
  search?: {
    urlPattern: string
    wordSeparator: string
    firstWordOnly?: boolean
    hmSuffix?: string
    sortMap?: {
      length?: string
      date?: string
    }
    hmFlag?: string
    hdFlag?: string
    pageProc?: (page: number) => number
  }
  thumb?: Thumb
  skip?: boolean
  debug?: boolean
  posterPrefix?: string
}

interface ScraperProps {
  scraps: Scrap[]
  apiInstance?: any
}

;(String.prototype as any).format = function () {
  let formatted = this
  for (let i = 0; i < arguments.length; i++) {
    let regexp = new RegExp('\\{' + i + '\\}', 'gi')
    formatted = formatted.replace(regexp, arguments[i])
  }
  return formatted
}

const Scraper: React.FC = (props: ScraperProps) => {
  const { scraps, apiInstance: propsInstance } = props
  if (!scraps) return

  const apiInstance = propsInstance || api.createAxiosInstance()
  const searchOffsets = [32, 64, 128]
  const searchSorts = ['date', 'length']
  const defaultSearchFilterDomain = []

  const [currentScrap, setCurrentScrap] = useState(scraps[0])
  const [thumbs, setThumbs] = useState([])
  const [search, setSearch] = useState([])
  const [page, setPage] = useState(1)
  const [remotePage, setRemotePage] = useState(1)
  const [offset, setOffset] = useState(searchOffsets[0])
  const [sort, setSort] = useState(searchSorts[0])
  const [forceHm, setForceHm] = useState(true)
  const [forceHd, setForceHd] = useState(false)
  const [filterDomain, setFilterDomain] = useState(defaultSearchFilterDomain)
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState([])
  let [data, setData] = useState([])
  const [searchHistory, setSearchHistory] = useState([])

  const [searchOptionsPanelOpen, setSearchOptionsPanelOpen] = useState(false)

  const visibleData = data.slice((page - 1) * offset, page * offset)

  let sliderTimeout: any

  const getDomain = (url: string) => {
    if (url.includes('//')) {
      return url.split('//')[1].split('/')[0].replace('www.', '')
    }
    return url.split('/')[0].replace('www.', '')
  }

  const calculatePages = (data: any[], offset: number): number[] => {
    const pages = []
    for (let i = 0; i < Math.ceil(data.length / offset); i++) {
      pages.push(i + 1)
    }
    return pages
  }

  const timeStringToSeconds = (timeString: string) => {
    let seconds = 0
    if (timeString.includes(':')) {
      const arr = timeString.split(':')
      let s = 1
      while (arr.length > 0) {
        const val = arr.pop().trim()
        const inc = parseInt(val, 10)
        seconds += s * inc
        s *= 60
      }
    } else if (timeString.includes('min') || timeString.includes('sec')) {
      let arr = timeString
        .replace('hours', 'h')
        .replace('hour', 'h')
        .replace('hr', 'h')
        .replace('minute', 'm')
        .replace('min', 'm')
        .replace('seconds', 's')
        .replace('second', 's')
        .replace('sec', 's')
        .split('h')

      seconds +=
        arr[1] || arr[1] === '' ? parseInt(arr.shift().trim(), 10) * 3600 : 0

      arr = arr[0].split('m')
      seconds +=
        arr[1] || arr[1] === '' ? parseInt(arr.shift().trim(), 10) * 60 : 0

      seconds += arr[0] ? parseInt(arr[0].replace('s', '').trim(), 10) : 0
    } else {
      console.log(`--UNKNOWN TS!!!`, timeString)
    }
    return seconds
  }

  const formatSeconds = (seconds: number): string => {
    let rest = seconds
    let formatted = ''
    let hr: number = 0
    let min: number = 0
    if (rest > 3600) {
      hr = Math.floor(rest / 3600)
      rest = rest - hr * 3600
      formatted += `${hr < 10 ? '0' + hr : hr}:`
    }
    if (rest > 60) {
      min = Math.floor(rest / 60)
      rest = rest - min * 60
      formatted += `${min < 10 ? '0' + min : min}:`
    } else {
      formatted += `00:`
    }
    formatted += `${rest < 10 ? '0' + rest : rest}`
    return formatted
  }

  const processScrap = async (scrap: any): Promise<any[]> => {
    const res = await apiInstance({
      method: 'get',
      url: '/tools/scraper/' + encodeURIComponent(scrap.url),
      responseType: 'document'
    })
    const items = []
    if (!res.data) {
      console.log(`----- NO DATA`, scrap.url, res)
      return []
    }
    for (const node of res.data.body.querySelectorAll(scrap.target)) {
      let poster: string
      let ts: string
      let ln: number = 0
      let source: string
      let label: string

      if (
        scrap.thumb?.skipIfContains &&
        node.querySelector(scrap.thumb.skipIfContains)
      ) {
        continue
      }

      const imgs = node.querySelectorAll('img')
      const links = node.querySelectorAll('a')

      if (scrap?.thumb?.ts) {
        const tsNode = node.querySelector(scrap.thumb.ts)
        ts = (tsNode?.innerText || tsNode?.innerHTML || '--').toLowerCase()
        if (ts == '--') {
          continue
        }
        if (scrap.thumb.tsProc) {
          ts = scrap.thumb.tsProc(tsNode?.innerHTML?.toLowerCase() || ts)
        }
        ln = timeStringToSeconds(ts)
        if (!ln || ln < 10) {
          continue
        }
      }
      if (scrap?.thumb?.label) {
        const labelNode = node.querySelector(scrap.thumb.label)
        label = labelNode?.innerText || labelNode?.innerHTML || '--'
      }
      if (scrap?.thumb?.source) {
        const sourceNode = node.querySelector(scrap.thumb.source)
        source = sourceNode?.innerText || sourceNode?.innerHTML || '--'
      }
      for (const img of imgs) {
        if (img.hasAttribute('data-src')) {
          img.setAttribute('src', img.getAttribute('data-src'))
        }
        if (img.hasAttribute('data-original')) {
          img.setAttribute('src', img.getAttribute('data-original'))
        }
      }
      let imgLink: string | undefined
      let linkText: string | undefined
      for (const link of links) {
        if (scrap?.thumb?.urlPrefix) {
          link.setAttribute(
            'href',
            scrap.thumb.urlPrefix + link.getAttribute('href')
          )
        }
        const linkImg = link.querySelector('img')
        if (linkImg) {
          imgLink = link.getAttribute('href')
          poster = linkImg.getAttribute('src')
        } else if (!linkText) {
          linkText = link.innerText || link.innerHTML
        }
      }
      const posterUrl = poster || imgs[0]?.getAttribute('src')
      let videoProp = {}
      if (scrap?.thumb?.video && posterUrl) {
        const { urlPattern, urlParams, urlTarget, urlAttribute } =
          scrap.thumb.video
        if (urlPattern) {
          const params = []
          for (const urlCallback of urlParams) {
            params.push(urlCallback(posterUrl))
          }
          videoProp = { video: urlPattern.format(...params) }
        }
        if (urlTarget) {
          videoProp = {
            video: node.querySelector(urlTarget)?.getAttribute(urlAttribute)
          }
        }
      }
      let sliderProp = {}
      if (scrap?.thumb?.slider && posterUrl) {
        const { urlPattern, urlParams } = scrap.thumb.slider
        const params = []
        for (const urlCallback of urlParams) {
          params.push(urlCallback(posterUrl))
        }
        const slider = []
        const limit = scrap.thumb.slider.limit || 10
        for (let i = 1; i <= limit; i++) {
          slider.push(urlPattern.format(...params).replace(/\{c\}/gi, i))
        }
        if (scrap.thumb.slider.pushPoster) {
          slider.push(posterUrl)
        }
        sliderProp = { slider }
      }
      let clipProp = {}
      if (imgs.length > 1) {
        const frames = []
        for (const img of imgs) {
          frames.push(img.getAttribute('src'))
        }
        clipProp = { clip: frames }
      }

      items.push({
        link: imgLink || links[0]?.getAttribute('href'),
        linkText: label || linkText || '--',
        ts,
        ln,
        source,
        domain: getDomain(scrap.search.urlPattern),
        bg: `url('${(scrap.posterPrefix || '') + posterUrl}')`,
        ...clipProp,
        ...videoProp,
        ...sliderProp
      })
    }
    return items
  }

  useEffect(() => {
    const handleSearch = async () => {
      if (search.length < 1) {
        return
      }
      const historyLabel = search.join(' ')
      if (historyLabel !== searchHistory[searchHistory.length - 1]) {
        setSearchHistory([...searchHistory, historyLabel])
        setData([])
        data = []
        setPage(1)
      }
      let res = []
      const resMap = {}
      const debug = scraps.find((s) => s.debug)
      for (const scrap of debug ? [debug] : scraps) {
        if (!scrap.search || scrap.skip) {
          continue
        }
        let wordsString = scrap.search.firstWordOnly
          ? search[0]
          : search.join(scrap.search.wordSeparator)

        if (scrap.search.hmSuffix && forceHm) {
          wordsString += scrap.search.wordSeparator + scrap.search.hmSuffix
        }
        scrap.url = scrap.search.urlPattern
          .replace(/\{words\}/gi, wordsString)
          .replace(
            /\{page\}/gi,
            scrap.search.pageProc
              ? scrap.search.pageProc(remotePage)
              : remotePage
          )
          .replace(/\{sort\}/gi, scrap.search.sortMap?.[sort] || sort)

        if (scrap.search.hmFlag) {
          scrap.url = scrap.url.replace(
            /\{hm\}/gi,
            forceHm ? scrap.search.hmFlag : ''
          )
        }

        if (scrap.search.hdFlag) {
          scrap.url = scrap.url.replace(
            /\{hd\}/gi,
            forceHd ? scrap.search.hdFlag : ''
          )
        }

        if (filterDomain.includes(getDomain(scrap.search.urlPattern))) {
          continue
        }
        const items = await processScrap(scrap)
        resMap[getDomain(scrap.search.urlPattern)] = items.length
        res = [...res, ...items]
      }
      const nData = [...data, ...res.sort((a, b) => b.ln - a.ln)]
      const nPages = []
      for (let i = 0; i < Math.ceil(nData.length / offset); i++) {
        nPages.push(i + 1)
      }
      setTotal(nData.length)
      setData(nData)
      setPages(nPages)
    }
    handleSearch()
  }, [search, remotePage])

  useEffect(() => {
    document.querySelector(`.main-content`).scrollTo(0, 0)
  }, [page])

  const handleScraper = async () => {
    const res = await apiInstance({
      method: 'get',
      url: '/tools/scraper/' + encodeURIComponent(currentScrap.url),
      responseType: 'document'
    })
    const scrapPanel = document.querySelector('.scraper .scraper-panel')
    if (res.data && !res.data.body.innerHTML) {
      console.log(`--resp`, res.data)
    }
    if (scrapPanel) {
      if (currentScrap?.target) {
        const items = []
        for (const node of res.data.body.querySelectorAll(
          currentScrap.target
        )) {
          let poster: string
          let ts: string
          let source: string
          let label: string

          const imgs = node.querySelectorAll('img')
          const links = node.querySelectorAll('a')

          if (currentScrap?.thumb?.ts) {
            const tsNode = node.querySelector(currentScrap.thumb.ts)
            ts = tsNode?.innerText || tsNode?.innerHTML || '--'
          }
          if (currentScrap?.thumb?.label) {
            const labelNode = node.querySelector(currentScrap.thumb.label)
            label = labelNode?.innerText || labelNode?.innerHTML || '--'
          }
          if (currentScrap?.thumb?.source) {
            const sourceNode = node.querySelector(currentScrap.thumb.source)
            source = sourceNode?.innerText || sourceNode?.innerHTML || '--'
          }
          for (const img of imgs) {
            if (img.hasAttribute('data-src')) {
              img.setAttribute('src', img.getAttribute('data-src'))
            }
            if (img.hasAttribute('data-original')) {
              img.setAttribute('src', img.getAttribute('data-original'))
            }
          }
          let imgLink: string | undefined
          let linkText: string | undefined
          for (const link of links) {
            if (currentScrap?.thumb?.urlPrefix) {
              link.setAttribute(
                'href',
                currentScrap.thumb.urlPrefix + link.getAttribute('href')
              )
            }
            const linkImg = link.querySelector('img')
            if (linkImg) {
              imgLink = link.getAttribute('href')
              poster = linkImg.getAttribute('src')
            } else if (!linkText) {
              linkText = link.innerText || link.innerHTML
            }
          }
          const posterUrl = poster || imgs[0]?.getAttribute('src')
          let videoProp = {}
          if (currentScrap?.thumb?.video && posterUrl) {
            const { urlPattern, urlParams, urlTarget, urlAttribute } =
              currentScrap.thumb.video
            if (urlPattern) {
              const params = []
              for (const urlCallback of urlParams) {
                params.push(urlCallback(posterUrl))
              }
              videoProp = { video: urlPattern.format(...params) }
            }
            if (urlTarget) {
              videoProp = {
                video: node.querySelector(urlTarget).getAttribute(urlAttribute)
              }
            }
          }
          let sliderProp = {}
          if (currentScrap?.thumb?.slider && posterUrl) {
            const { urlPattern, urlParams } = currentScrap.thumb.slider
            const params = []
            for (const urlCallback of urlParams) {
              params.push(urlCallback(posterUrl))
            }
            const slider = []
            const limit = currentScrap.thumb.slider.limit || 10
            for (let i = 1; i <= limit; i++) {
              slider.push(urlPattern.format(...params).replace(/\{c\}/gi, i))
            }
            if (currentScrap.thumb.slider.pushPoster) {
              slider.push(posterUrl)
            }
            sliderProp = { slider }
          }
          let clipProp = {}
          if (imgs.length > 1) {
            const frames = []
            for (const img of imgs) {
              frames.push(img.getAttribute('src'))
            }
            clipProp = { clip: frames }
          }

          items.push({
            link: imgLink || links[0]?.getAttribute('href'),
            linkText: label || linkText || '--',
            ts,
            source,
            bg: `url('${posterUrl}')`,
            ...clipProp,
            ...videoProp,
            ...sliderProp
          })
        }
        setThumbs(items)
      } else {
        scrapPanel.innerHTML = res.data.body.innerHTML
      }
    }
    //const scrapFrame: any = document.querySelector('#scraperframe')
    //scrapFrame.src = 'data:text/html;charset=utf-8,' + escape(res.data.body.innerHTML)
  }
  const [tabIndex, setTabIndex] = useState(0)
  const switchTab = (ev: any) => {
    setTabIndex(ev.detail.index)
  }

  useEffect(() => {
    const handleResize = () => {
      const itms = document.querySelectorAll(`.scraper-thumb`)
      const winW = window.innerWidth
      const winH = window.innerHeight
      for (const itm of itms) {
        /*if ((itm as any).style.transform) {
          alert((itm as any).style.transform)
        }*/
        const w = (itm as any).offsetWidth
        const h = (itm as any).offsetHeight
        const { left, top } = itm.getBoundingClientRect()
        let originL = 'center'
        let originT = 'center'
        if (left + w / 2 < winW / 6) {
          originL = 'left'
        }
        if (left + w / 2 > (winW / 6) * 5) {
          originL = 'right'
        }
        if (top + h / 2 < winH / 3) {
          originT = 'top'
        }
        if (top + h / 2 > (winH / 3) * 2) {
          originT = 'bottom'
        }
        ;(itm as any).style.transformOrigin = `${originL} ${originT}`
      }
    }
    handleResize()
    window.removeEventListener('resize', handleResize)
    window.addEventListener('resize', handleResize)
    document
      .querySelector(`.main-content`)
      .removeEventListener('scroll', handleResize)
    document
      .querySelector(`.main-content`)
      .addEventListener('scroll', handleResize)
  })

  const searchMin = 2
  return (
    <div className="scraper">
      {/*<TabBar onActivation={switchTab}>
        <Tab icon="favorites" tabIndex={0} isActive={tabIndex === 0}>
          Search
        </Tab>
        <Tab tabIndex={1} isActive={tabIndex === 1}>
          Scrap
        </Tab>
  </TabBar>*/}
      <div
        className="scraper-preview"
        style={tabIndex === 0 ? {} : { display: 'none' }}
      >
        <Textfield
          name="search"
          label={'Search' + (total > 0 ? ' (' + total + ')' : '')}
          placeholder=""
          defaultValue=""
          icon="search"
          trailingIcon="event"
          helper=""
          required={false}
          minLength={`${searchMin}`}
          outlined={true}
          maxLength={40}
          showCounter={false}
          fullwidth={true}
          onKeyUp={(e) => {
            if (e.code === 'Enter') {
              let val = e.target.value.trim()
              while (val.includes('  ')) {
                val = val.replace('  ', ' ')
              }
              e.target.value = val
              if (val === searchHistory[searchHistory.length - 1]) {
                return
              }
              if (val.length > searchMin) {
                setSearch(
                  val.trim().split(' ')
                  //.filter((s) => s.length > searchMin)
                )
              }
            }
          }}
        />
        <div
          className={
            'scraper-search-options-panel' +
            (searchOptionsPanelOpen ? ' scraper-search-options-panel-open' : '')
          }
        >
          <div
            className="scraper-search-options-backdrop"
            onClick={() => setSearchOptionsPanelOpen(false)}
          />
          <div className="scraper-search-options">
            <div className="scraper-search-option">
              <div
                className={
                  'option-indicator' +
                  (forceHm ? ' option-indicator-active' : '')
                }
                onClick={() =>
                  setSearchOptionsPanelOpen(!searchOptionsPanelOpen)
                }
              >
                <span className="material-icons">text_format</span>
              </div>
              <Checkbox
                hideHelperLine={true}
                name="hm"
                label="Force HM"
                defaultChecked={forceHm}
                onChange={() => setForceHm(!forceHm)}
              />
            </div>
            <div className="scraper-search-option">
              <div
                className={
                  'option-indicator' +
                  (forceHd ? ' option-indicator-active' : '')
                }
                onClick={() =>
                  setSearchOptionsPanelOpen(!searchOptionsPanelOpen)
                }
              >
                <span className="material-icons">high_quality</span>
              </div>
              <Checkbox
                hideHelperLine={true}
                name="hd"
                label="Force HD"
                defaultChecked={forceHd}
                onChange={() => setForceHd(!forceHd)}
              />
            </div>
            <div className="scraper-search-option">
              <div
                className="sort-indicator"
                onClick={() =>
                  setSearchOptionsPanelOpen(!searchOptionsPanelOpen)
                }
              >
                <span className="material-icons">sort</span>
                <div className="sort-items">
                  <span
                    className={
                      'sort-item' +
                      (sort === 'length' ? ' sort-item-active' : '')
                    }
                  >
                    L
                  </span>
                  <span
                    className={
                      'sort-item' + (sort === 'date' ? ' sort-item-active' : '')
                    }
                  >
                    D
                  </span>
                </div>
              </div>
              <Radio
                hideHelperLine={true}
                label="Length"
                name="sort"
                defaultChecked={sort === 'length'}
                onChange={() => setSort('length')}
              />
              <div className="sort-separator" />
              <Radio
                hideHelperLine={true}
                label="Date"
                name="sort"
                defaultChecked={sort === 'date'}
                onChange={() => setSort('date')}
              />
            </div>
          </div>
          <div className="scraper-filter">
            <div
              className="filter-indicator"
              onClick={() => setSearchOptionsPanelOpen(!searchOptionsPanelOpen)}
            >
              <span>{scraps.length - filterDomain.length}</span>
            </div>
            <div className="scraper-filter-domains">
              {scraps.map((scrap) => {
                const domain = getDomain(scrap.search.urlPattern)
                return (
                  <div key={'dd-' + domain} className="scraper-filter-domain">
                    <Checkbox
                      className="okx-compact"
                      hideHelperLine={true}
                      name="domains[]"
                      label={domain}
                      defaultChecked={!filterDomain.includes(domain)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          filterDomain.splice(
                            filterDomain.findIndex((d: string) => d === domain),
                            1
                          )
                        } else {
                          filterDomain.push(domain)
                        }
                        setFilterDomain([...filterDomain])
                      }}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        <br />
      </div>
      <div
        className="screper-details"
        style={tabIndex === 1 ? {} : { display: 'none' }}
      >
        <div className="flex-row">
          <div className="flex-cell flex-cell-min">
            <br />
            <Select
              onChange={(val: string) => {
                const itm = scraps.find((itm) => itm.url === val)
                if (itm) {
                  setCurrentScrap(itm)
                }
              }}
              value={currentScrap.url}
            >
              {scraps.map((pscrap, i) => (
                <Option
                  key={'l-' + i}
                  value={pscrap.url}
                  label={pscrap.url}
                  selected={pscrap.url === currentScrap.url}
                />
              ))}
            </Select>
            <br />
          </div>
          <div className="flex-cell">
            <Button outlined onClick={handleScraper}>
              Scrap
            </Button>
          </div>
        </div>
      </div>
      <div className="scraper-panel" />
      <div className="thumbs-panel">
        {(visibleData.length > 0 ? visibleData : thumbs).map(
          (thumb: Thumb, i: number) => (
            <div key={`scth-${i}`} className="scraper-thumb">
              <a href={thumb.link} target="_blank">
                <div
                  className="scraper-thumb-img"
                  style={{ backgroundImage: thumb.bg }}
                >
                  {thumb.video && (
                    <video
                      data-src={thumb.video}
                      loop={true}
                      muted={true}
                      onMouseOver={(e) => {
                        const src = e.target.getAttribute('data-src')
                        if (src) {
                          e.target.setAttribute(
                            'src',
                            e.target.getAttribute('data-src')
                          )
                          e.target.play().catch(() => {})
                        }
                      }}
                      onMouseOut={(e) => {
                        e.target.removeAttribute('src')
                      }}
                    />
                  )}
                  {thumb.slider && (
                    <div
                      className="slider"
                      onMouseOver={(e) => {
                        sliderTimeout = setTimeout(() => {
                          e.target.parentNode.insertBefore(
                            e.target,
                            e.target.parentNode.children[0]
                          )
                        }, 700)
                      }}
                      onMouseOut={() => clearTimeout(sliderTimeout)}
                    >
                      {thumb.slider.map((slide, i) => (
                        <img
                          src={slide}
                          key={'slide-' + i}
                          onError={(e: any) =>
                            (e.target.style.display = 'none')
                          }
                        />
                      ))}
                    </div>
                  )}
                  {(thumb.source || thumb.domain) && (
                    <div className="scraper-thumb-source">
                      {thumb.source || thumb.domain}
                    </div>
                  )}
                  <div className="scraper-thumb-ts">
                    {formatSeconds(thumb.ln)}
                  </div>
                </div>
              </a>
              <div className="scraper-thumb-info">
                <a href={thumb.link} target="_blank">
                  {thumb.linkText}
                </a>
              </div>
            </div>
          )
        )}
        {visibleData.length > 0 && visibleData.length < offset && (
          <div
            className="scraper-more"
            onClick={() => {
              setRemotePage(remotePage + 1)
            }}
          >
            More ..
          </div>
        )}
      </div>
      {visibleData.length > 0 && (
        <div className="scraper-paginator">
          <span className="total">Total: {total}</span>
          <span>
            <Select
              className="okx-compact"
              noHelperText={true}
              onChange={(val: number) => {
                setPages(calculatePages(data, val))
                setOffset(val)
                if (page > 1) {
                  setPage(1)
                }
              }}
              value={`${offset}`}
            >
              {searchOffsets.map((searchOffset, i) => (
                <Option
                  key={'so-' + i}
                  value={searchOffset}
                  label={searchOffset}
                  selected={searchOffsets === offset}
                />
              ))}
            </Select>
          </span>
          <span
            className={
              'scraper-paginator-page' + (page === 1 ? ' disabled' : '')
            }
            onClick={() => {
              if (page > 1) setPage(1)
            }}
          >
            ..
          </span>
          <span
            className={
              'scraper-paginator-page' + (page === 1 ? ' disabled' : '')
            }
            onClick={() => {
              if (page > 1) setPage(page - 1)
            }}
          >
            .
          </span>
          {pages.map((p: number) => (
            <span
              key={`nav-page-` + p}
              className={
                'scraper-paginator-page' + (p === page ? ' selected' : '')
              }
              onClick={() => setPage(p)}
            >
              {p}
            </span>
          ))}
          <span
            className={
              'scraper-paginator-page' +
              (page === pages.length ? ' disabled' : '')
            }
            onClick={() => {
              if (page < pages.length) setPage(page + 1)
            }}
          >
            .
          </span>
          <span
            className={
              'scraper-paginator-page' +
              (page === pages.length ? ' disabled' : '')
            }
            onClick={() => {
              if (page < pages.length) setPage(pages.length)
            }}
          >
            ..
          </span>
        </div>
      )}
    </div>
  )
}

export default Scraper
