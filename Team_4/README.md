# NBA 年度選秀視覺化 (1996~2015) 

目前網路上尚未看見有針對選秀做出的視覺化圖形，利用地圖與各州隊伍隊徽，搭配年度及每年第一輪選秀資料能夠輕易看出各隊選出的新秀，並響應超級偉大的球星“Kobe Bryant”宣布退休，所以以超明星年度1996(某些年度的平均新秀水準會高於其他年度)當作我們選定的開始年度，像黑曼巴精神致敬！

 - 預期達成效果：利用美洲地圖，讓人聯想到球隊後，再利用紅色或藍色的按鈕，讓使用者可以點選時間軸並選擇球員，按鈕的半徑大小使用球員生涯在球場上的影響度來做判別(得分、籃板、助攻...等)，影響度越大者半徑越大，使用者點擊進去後可觀看球員的生涯資料和影片highlight，並以當年度所有球員第一年薪資長條圖與其貢獻度做比較，有些順位很前面的球員卻未能打出身價，反而順位較後面者成為史上巨星，藉由此圖像化可以使資料呈現更直觀且生動！最後加入每位球員精彩影片，增加使用者目光停留時間，能回味當年所愛的球星風采！

 - 結果探討：
    我們發現第一年薪資，多數照選秀順序來形成一個線性跌幅，現今叱吒風雲的球星們，70%出自於選秀前10名，每年度約有一半的球員是我們所不認識的，許多球員在選秀後非傷及痛，或前往歐洲或中國大陸打球，前五名中大約只有兩名能夠打出名堂，有些會快速殞落，或淪為二線球員，甚至有些球員因為品行（自傲或吸毒酗酒鬥毆）而自毀前程，能夠存活於NBA場上的球員真的是有實力又有健康及運氣！現今球探雖已有數據化思維來客觀選秀，但是否能夠準確是我們可以持續觀察的項目！

 - 開發流程：
   
   1.搜集資料(各隊州名及隊徽，各年度選秀資料，球員生涯成績資料，highlights影片)
   
   2.圖像化製作by D3.js(全美洲地圖圖像化，帶入數據按鈕大小圖像化，年度timeline捲軸，長條圖)
   
   3.加入球員資料表格


# 網站網址：[NBA Year Draft Visualization](http://o4siang.github.io/data-visualization-proj/Team_4/)