// Проверка поддержки webp
export function isWebp() {
  function testWebP(callback) {
    const webP = new Image();
    webP.onload = webP.onerror = function () {
      callback(webP.height == 2);
    };
    webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
  }
  // Добавление класса для HTML
  testWebP(function (support) {
    if (support == true) {
      document.documentElement.classList.add('webp');
    }
    else {
      document.querySelector('body').classList.add('no-webp');
    }
  });
}
// Проверка поддержки avif и webp
export function isAvifWebp() {
  // Проверка поддержки avif
  function testAvif(callback) {
    let AviF = new Image()
    AviF.onload = AviF.onerror = function () {
      callback(AviF.height == 2)
    }
    AviF.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A='
  }
  // Проверка поддержки webp
  function testWebp(callback) {
    let webP = new Image()
    webP.onload = webP.onerror = function () {
      callback(webP.height == 2)
    }
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA'
  }
  // проверка на IE
  function isInternetExplorer() {
    return window.navigator.userAgent.indexOf('MSIE ') > -1 || window.navigator.userAgent.indexOf('Trident/') > -1;
  }

  // Добавление класса для HTML
  // if (isInternetExplorer() === false) {
  // Добавление класса _avif для HTML 
  testAvif(function (support) {
    if (support === true) {
      document.documentElement.classList.add('avif')
    } else {
      // Добавление класса _webp или _no-webp для HTML 
      testWebp(function (support) {
        let className = support === true ? 'webp' : 'no-webp'
        document.documentElement.classList.add(className)
      })
    }
  })
  // } else {
  //   document.documentElement.classList.add('no-webp')
  // }

}

 