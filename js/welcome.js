function openOptions(){

chrome.tabs.create({
	            url: chrome.runtime.getURL("/html/options.html?install=1")
	        });

}

document.getElementById("startBtn").onclick=openOptions;

document.getElementById("startBtn2").onclick=openOptions;




