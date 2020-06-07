particlesJS("particles-js", {"particles":{"number":{"value":80,"density":{"enable":true,"value_area":600}},"color":{"value":"#000000"},"shape":{"type":"circle","stroke":{"width":0,"color":"#000000"},"polygon":{"nb_sides":5},"image":{"src":"img/github.svg","width":100,"height":100}},"opacity":{"value":0.5,"random":false,"anim":{"enable":false,"speed":1,"opacity_min":0.1,"sync":false}},"size":{"value":3,"random":true,"anim":{"enable":false,"speed":40,"size_min":0.1,"sync":false}},"line_linked":{"enable":true,"distance":150,"color":"#000000","opacity":0.4,"width":1},"move":{"enable":true,"speed":6,"direction":"none","random":false,"straight":false,"result_mode":"result","bounce":false,"attract":{"enable":false,"rotateX":600,"rotateY":1200}}},"interactivity":{"detect_on":"canvas","events":{"onhover":{"enable":true,"mode":"grab"},"onclick":{"enable":true,"mode":"push"},"resize":true},"modes":{"grab":{"distance":400,"line_linked":{"opacity":1}},"bubble":{"distance":400,"size":40,"duration":2,"opacity":8,"speed":3},"repulse":{"distance":200,"duration":0.4},"push":{"particles_nb":4},"remove":{"particles_nb":2}}},"retina_detect":true});


function eqAlign() {
    first = document.getElementById("first").value;
    second = document.getElementById("second").value;
    third = document.getElementById("third").value;

    eq = first + "+" + second + "->" + third;
    return eq;
}
function solve(x) {

    //num multiply
	mulNum = 1;
    numArray = new Set(x.split(/\D+/g));  
    numArray.delete("");
    
    for (let i of numArray) {
        mulNum *= parseInt(i);
    }
    
    //split sides and mol num = var num
	left = x.split("->")[0].split("+");
	right = x.split("->")[1].split("+");
	mol = left.length + right.length;
    
    //find elements, replace non-element char, remove repeats and remove ""
	elems = new Set(x.replace(/\d+|\+|->/g,"").match(/([A-Z][a-z]*)/g));
	elems.delete("");
    
    //loop elements
	refArray = [];
    for (let elem of elems) {
		buildArray = [];

        //left side
        for (let mol of left) {
            index = mol.indexOf(elem);
            
			if (index == -1) {
				buildArray.push(0);
			} 
			else {
				index += elem.length;
				afterNum = mol.substring(index).match(/^\d+/g);

				if (afterNum == null) {
                    buildArray.push(1);
                } 
				else {
                    buildArray.push(parseInt(afterNum));
                } 
			}
		}

        //right side
        for (let mol of right) {
            index = mol.indexOf(elem);
            
			if (index == -1) {
				buildArray.push(0);
			} 
			else {
				index += elem.length;
                afterNum = mol.substring(index).match(/^\d+/g);
                
				if (afterNum == null) {
                    buildArray.push(-1);
                } 
                else {
                    buildArray.push(parseInt(afterNum)*(-1));
                }             
			}
		}
		refArray.push(buildArray);
	}
	
    //algorithm, no empty mol
	for (piv = 0; piv < Math.min(mol, elems.size) ; piv++) {

        for (i = piv; i < refArray.length; i++) {
            row = refArray[i];
            
			if (row[piv] != 0) {
				rowWork = refArray.splice(refArray.indexOf(row), 1)[0];
			}
		}
        mul = mulNum / rowWork[piv];
        
		for (i = 0; i < rowWork.length; i++) {
            rowWork[i] *= mul
        } 
        for (let i in refArray) {
            row = refArray[i];
            
			if (row[piv] != 0) {
                mul = mulNum / row[piv]
                
				for (j = 0; j < row.length; j++) {
					row[j] *= mul;
					row[j] -= rowWork[j];
					row[j] /= mul;
				}
				refArray[i] = row;
			}
		}
        refArray.splice(piv, 0, rowWork);
	}
	
    if (refArray[0][elems.size] == 0 || refArray[0][elems.size] == undefined) {
		return "Грешка!";
	} 
	
	mulNum *= -1;
	gcd_calc = function(a, b) {
		if (!b) {
			return a;
		} 
		return gcd_calc(b, a%b);
	};

	coEffs = [];
	gcd = mulNum;
	for (i = 0; i < refArray.length; i++) {
		num = refArray[i][mol-1];
		coEffs.push(num);
		gcd = gcd_calc(gcd, num)
	}
	coEffs.push(mulNum);
	for (i = 0; i < coEffs.length; i++) {
		coEffs[i] /= gcd;
	} 
	
	result = "";
	for (i = 0; i < coEffs.length; i++) {
		coEff = coEffs[i];

		if (coEff != 1) {
			result += coEff;
		}

		result += left.shift();
		if (left.length == 0 && right.length != 0) {
			result += " -> ";
			left = right;
		} else if  (i != coEffs.length-1) {
			result += " + ";
		} 
	}
	return result;
}

document.getElementById("buttonEq").onclick = () => {
	let first = document.getElementById("first");
	let second = document.getElementById("second");
	let third = document.getElementById("third");

	if (first.value != "" && second.value != "" && third.value != "") {
		resultLabel = document.getElementById("resultLabel");

		resultLabel.value = solve(eqAlign());
		resultLabel.innerHTML = solve(eqAlign());
	
		if (resultLabel.value == "Грешка!") {
			resultLabel.style.borderBottomColor = "red";
		}
		else {
			resultLabel.style.borderBottomColor = "green";
		}	
	}
	else if (first.value == "") {
		first.focus();
	}
	else if (second.value == "") {
		second.focus();
	}
	else if (third.value == "") {
		third.focus();
	}

}
document.getElementById("buttonClear").onclick = () => {
	let first = document.getElementById("first");
	let second = document.getElementById("second");
	let third = document.getElementById("third");

	let result = document.getElementById("resultLabel");
	result.innerHTML = "";

	first.value = "";
	second.value = "";
	third.value = "";
}