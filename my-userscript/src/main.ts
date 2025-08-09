import style from './styles/global.module.css'
import logo from './images/tampermonkey.svg'
import { renderIcon } from './svg/sprite'
import t from './locales'

const container = document.createElement('div')
container.classList.add(style.container)

const imgEl = document.createElement('img')
imgEl.setAttribute('src', logo)
imgEl.classList.add(style.logo)
container.appendChild(imgEl)

const mainEl = document.createElement('main')
mainEl.innerHTML =
  `<h1>${t('title').toUpperCase()}</h1>` +
  `<ul class=${style.supports}>
  ${[
    'support-es',
    'support-css',
    'support-static',
    'support-svg-sprite',
    'support-locale',
    'support-plugin'
  ]
    .map((key) => `<li>${renderIcon('check', style.check).outerHTML}${t(key)}</li>`)
    .join('\n')}
  </ul>
  `
container.appendChild(mainEl)

const getItButton = document.createElement('div')
getItButton.textContent = t('got-it')
getItButton.classList.add(style.button)
container.appendChild(getItButton)
getItButton.addEventListener('click', () => {
  container.classList.add(style.hide)
})

document.body.appendChild(container)
