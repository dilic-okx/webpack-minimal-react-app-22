import React, { useEffect, useState } from 'react'
import Button from '../../components/button'
import Layout from '../../components/layout'
import Scraper from '../../components/scraper'
import api from '../../lib/api'

import './index.css'

const scraps = [
  {
    url: 'https://www.nudevista.com/?q=anal+mom&o=d&s=t',
    search: {
      urlPattern:
        'https://www.nudevista.com/?q={words}&o={sort}&start={page}&s=t',
      wordSeparator: '+',
      hmSuffix: 'in:bizarre',
      sortMap: {
        length: 'd',
        date: 'n'
      },
      pageProc: (page) => (page - 1) * 25
    },
    target: '#listing td',
    thumb: {
      ts: 'i[itemprop="duration"]',
      source: '.tube a[itemprop="url"]',
      slider: {
        urlPattern: '{0}.{c}.jpg',
        urlParams: [
          (url) => {
            const arr = url.split('/')
            const last = arr.pop().split('.')[0]
            return [...arr, last].join('/')
          }
        ],
        pushPoster: true,
        limit: 6
      }
    }
  },
  {
    url: 'https://www.pornhub.com/video/search?search=anal+mom&p=homemade&o=lg&page=2',
    search: {
      urlPattern:
        'https://www.pornhub.com/video/search?search={words}&o={sort}&page={page}{hm}{hd}',
      wordSeparator: '+',
      sortMap: {
        length: 'lg',
        date: 'mr'
      },
      hmFlag: '&p=homemade',
      hdFlag: '&hd=1'
    },
    target: '#videoSearchResult li',
    thumb: {
      urlPrefix: 'https://www.pornhub.com',
      ts: '.duration',
      video: {
        urlTarget: 'img.thumb',
        urlAttribute: 'data-mediabook'
      }
    }
  },
  {
    url: 'https://xhamster.com/search/anal+mom?sort=longest&page=2&revert=orientation',
    search: {
      urlPattern:
        'https://xhamster.com/search/{words}?sort={sort}&page={page}{hm}{hd}&revert=orientation',
      wordSeparator: '+',
      sortMap: {
        length: 'longest',
        date: 'newest'
      },
      hmFlag: '&prod=creators',
      hdFlag: '&quality=720p'
    },
    target: '.thumb-list__item.video-thumb',
    thumb: {
      ts: '[data-role="video-duration"]',
      video: {
        urlTarget: 'a.thumb-image-container',
        urlAttribute: 'data-previewvideo'
      }
    }
  },
  {
    url: 'https://www.xvideos.com/tags/s:length/mature-dildo-ride/4',
    search: {
      urlPattern: 'https://www.xvideos.com/tags/s:{sort}{hd}/{words}/{page}',
      wordSeparator: '-',
      sortMap: {
        date: 'uploaddate'
      },
      hdFlag: '/q:hd'
    },
    target: '.thumb-block',
    thumb: {
      urlPrefix: 'https://www.xvideos.com',
      ts: '.duration',
      video: {
        urlPattern: 'https://{0}/videos/videopreview/{1}_169.mp4',
        urlParams: [
          (url) => url.split('://')[1].split('/')[0],
          (url) => {
            const arr = url.split('://')[1].split('/')
            return [arr[3], arr[4], arr[5], arr[6]].join('/')
          }
        ]
      }
    }
  },
  {
    url: 'https://www.camwhoreshd.com/search/squirt-gape/?from_videos=3&sort_by=duration',
    search: {
      urlPattern:
        'https://www.camwhoreshd.com/search/{words}/?from_videos={page}&sort_by={sort}',
      wordSeparator: '-',
      firstWordOnly: true,
      sortMap: {
        length: 'duration',
        date: 'post_date'
      },
      pageProc: (page) => page + 1
    },
    target: '.list-videos .item',
    thumb: {
      ts: '.duration',
      label: 'strong.title',
      slider: {
        urlPattern:
          'https://www.camwhoreshd.com/contents/videos_screenshots/{0}/{c}.jpg',
        urlParams: [
          (url) => {
            const arr = url.split('://')[1].split('/')
            return [arr[3], arr[4], arr[5]].join('/')
          }
        ],
        limit: 5
      }
    }
  },
  {
    url: 'https://katitube.com/search/videos/mature/longest/page11.html',
    search: {
      urlPattern: 'https://katitube.com/search/videos/{words}/{sort}/{page}',
      wordSeparator: '-',
      sortMap: {
        length: 'longest',
        date: 'newest'
      },
      pageProc: (page) => (page > 1 ? `page${page}.html` : '')
    },
    target: '.contents .content',
    thumb: {
      ts: '.text .left',
      //label: '.title-thumb a',
      slider: {
        urlPattern: '{0}-{c}.jpg',
        urlParams: [
          (url) => {
            const arr = url.split('-')
            arr.pop()
            return arr.join('-')
          }
        ],
        limit: 5
      }
    }
  },
  {
    url: 'https://www.youporn.com/search/duration/?query=mom+dildo&page=2',
    search: {
      urlPattern:
        'https://www.youporn.com/search/{sort}/?query={words}&page={page}{hd}',
      wordSeparator: '+',
      sortMap: {
        length: 'duration',
        date: 'date'
      },
      hdFlag: '&res=HD'
    },
    target: '.searchResults .video-box',
    thumb: {
      urlPrefix: 'https://www.youporn.com',
      ts: '.video-duration',
      video: {
        urlTarget: 'img.thumb-image',
        urlAttribute: 'data-mediabook'
      }
    }
  },
  {
    url: 'https://en.pornoreino.com/search-porn/dildo-mom/2?sort_by=duration&category_ids=&q=dildo+mom',
    search: {
      urlPattern:
        'https://en.pornoreino.com/search-porn/{words}/{page}?sort_by={sort}/',
      wordSeparator: '-',
      sortMap: {
        length: 'duration',
        date: 'post_date'
      }
    },
    target: '.list-videos .item',
    thumb: {
      label: 'strong.title',
      ts: '.duration',
      video: {
        urlTarget: 'img.thumb',
        urlAttribute: 'data-preview'
      }
    }
  },
  {
    url: 'https://www.moviefap.com/search/mom+dildo/duration/1',
    search: {
      urlPattern: 'https://www.moviefap.com/search/{words}/{sort}/{page}',
      wordSeparator: '+',
      sortMap: {
        length: 'duration',
        date: 'adddate'
      }
    },
    target: '#browse_full div.videothumb',
    thumb: {
      ts: '.videoleft',
      tsProc: (ts) => ts.split('<br')[0].trim(),
      slider: {
        urlPattern: '{0}/{c}.jpg',
        urlParams: [
          (url) => {
            const arr = url.split('/')
            arr.pop()
            return arr.join('/')
          }
        ],
        pushPoster: true,
        limit: 25
      }
    }
  },
  {
    url: 'https://www.shesfreaky.com/search/mom-dildo/longest/page2.html?setFilter=videos',
    search: {
      urlPattern:
        'https://www.shesfreaky.com/search/{words}/{sort}/page{page}.html?setFilter=videos',
      wordSeparator: '-',
      sortMap: {
        length: 'longest',
        date: 'most-recent'
      }
    },
    target: '.main-content div.item',
    thumb: {
      ts: '.thumb-length',
      video: {
        urlTarget: 'div.thumb',
        urlAttribute: 'data-preview'
      }
    } /*,
    posterPrefix: 'https:'*/
  },
  {
    url: 'https://xxxbunker.com/search/mom+dildo/page-2?sort=duration',
    search: {
      urlPattern: 'https://xxxbunker.com/search/{words}{page}?sort={sort}',
      wordSeparator: '+',
      sortMap: {
        length: 'duration',
        date: 'dateadded'
      },
      pageProc: (page) => (page > 1 ? `/page-${page}` : '')
    },
    target: '.thumbnail-list > div:not(.section-header)',
    thumb: {
      label: 'span.title',
      ts: '.duration',
      urlPrefix: 'https://xxxbunker.com',
      slider: {
        urlPattern: '{0}-{c}.jpg',
        urlParams: [
          (url) => {
            const arr = url.split('.')
            arr.pop()
            return arr.join('.')
          }
        ],
        pushPoster: true,
        limit: 5
      }
    }
  },
  {
    url: 'https://www.amateurest.com/search/mom-dildo/?sort_by=duration&from_videos=3',
    search: {
      urlPattern:
        'https://www.amateurest.com/search/{words}/?sort_by={sort}&from_videos={page}',
      wordSeparator: '-',
      sortMap: {
        length: 'duration',
        date: 'post_date'
      }
    },
    target: '.list-videos div.item',
    thumb: {
      label: 'strong.title',
      skipIfContains: '.line-private',
      ts: '.duration',
      slider: {
        urlPattern: '{0}/{c}.jpg',
        urlParams: [
          (url) => {
            const arr = url.split('/')
            arr.pop()
            return arr.join('/')
          }
        ],
        limit: 10
      }
    }
  },
  {
    url: 'https://www.pervertium.com/search/mom-dildo/?sort_by=duration&from_videos=2',
    search: {
      urlPattern:
        'https://www.pervertium.com/search/{words}/?sort_by={sort}&from_videos={page}{hd}',
      wordSeparator: '-',
      sortMap: {
        length: 'duration',
        date: 'post_date'
      },
      hdFlag: '&is_hd=1'
    },
    target: '.list-videos div.item',
    thumb: {
      label: 'strong.title',
      skipIfContains: '.line-private',
      ts: '.duration',
      video: {
        urlTarget: 'img.thumb',
        urlAttribute: 'data-preview'
      }
    }
  }
]

const Search: React.FC = () => {
  const apiInstance = api.createAxiosInstance()
  const [data, setData] = useState({})

  useEffect(() => {
    let mounted = true
    const getData = async () => {
      const res = await apiInstance({
        method: 'get',
        url: '/get-api-config'
      })
      if (mounted) {
        setData(res.data)
      }
    }
    getData()
    return () => (mounted = false)
  }, [])

  return (
    <Layout label="Search" compact={true}>
      <div className="flex-col">
        <div className="flex-cell">
          <Scraper scraps={scraps} />
        </div>
      </div>
    </Layout>
  )
}

export default Search
