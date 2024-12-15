let hiragana = {
    'あ행': [
        ['あ', 'い', 'う', 'え', 'お'],
        ['아(a)', '이(i)', '우(u)', '에(e)', '오(o)']
    ],
    'か행': [
        ['か', 'き', 'く', 'け', 'こ'],
        ['카(ka)', '키(ki)', '쿠(ku)', '케(ke)', '코(ko)']
    ],
    'さ행': [
        ['さ', 'し', 'す', 'せ', 'そ'],
        ['사(sa)', '시(shi)', '스(su)', '세(se)', '소(so)']
    ],
    'た행': [
        ['た', 'ち', 'つ', 'て', 'と'],
        ['타(ta)', '치(chi)', '츠(tsu)', '테(te)', '토(to)']
    ],
    'な행': [
        ['な', 'に', 'ぬ', 'ね', 'の'],
        ['나(na)', '니(ni)', '누(nu)', '네(ne)', '노(no)']
    ],
    'は행': [
        ['は', 'ひ', 'ふ', 'へ', 'ほ'],
        ['하(ha)', '히(hi)', '후(hu/fu)', '헤(he)', '호(ho)']
    ],
    'ま행': [
        ['ま', 'み', 'む', 'め', 'も'],
        ['마(ma)', '미(mi)', '무(mu)', '메(me)', '모(mo)']
    ],
    'や행': [
        ['や', '', 'ゆ', '', 'よ'],
        ['야(ya)', '', '유(yu)', '', '요(yo)']
    ],
    'ら행': [
        ['ら', 'り', 'る', 'れ', 'ろ'],
        ['라(ra)', '리(ri)', '루(ru)', '레(re)', '로(ro)']
    ],
    'わ행': [
        ['わ', '', '', '', 'を'],
        ['와(wa)', '', '', '', '오(wo)']
    ],
    'ん': [
        ['ん', '', '', '', ''],
        ['응(n/m/ng)', '', '', '', '']
    ]
    /**ん[응(n/m/ng)]생략*/
};

const keys = Object.keys(hiragana);

let table = document.getElementById('hiragana-table');

let thead = document.createElement('thead');

let tr = document.createElement('tr');

let th = document.createElement('th');
tr.appendChild(th);
for (let i = 0; i < hiragana[keys[0]][0].length; i++) {
    let th = document.createElement('th');
    th.innerText = hiragana[keys[0]][0][i]+'단';
    tr.appendChild(th);
}

thead.appendChild(tr);

let tbody = document.createElement('tbody');


for (let i = 0; i < keys.length; i++) {
    let tr = document.createElement('tr');
    let th = document.createElement('th');
    th.innerText = keys[i];
    tr.appendChild(th);

    let value = hiragana[keys[i]];
    for (let k = 0; k < value[0].length; k++) {
        let td = document.createElement('td');
        td.innerHTML = value[0][k]+'<br><small>'+value[1][k]+'</small>';
        tr.appendChild(td);
    }
    
    tbody.appendChild(tr);
}

table.append(thead, tbody);

function sequence() {
    document.querySelectorAll('input[name="sequence"]').forEach((e, i) => {
        if (!document.getElementById(e.id.replace('seq-', '')).checked) {
            e.disabled = true;
            e.checked = false;
            // 하나라도 비활성화 되면 seq-random 비활성화
            document.getElementById('seq-random').disabled = true;
            document.getElementById('seq-random').checked = false;
        } else {
            e.disabled = false;
        }
    });
    // 아무것도 선택되지 않은 경우 선택 가능한 요소 체크
    if(!document.querySelector('input[name="sequence"]:checked')&&document.querySelector('input[name="sequence"]:not([disabled])')){
        document.querySelector('input[name="sequence"]:not([disabled])').checked = true;
    }
}

let history = [];
function randomTest() {
    let checkbox = {
        random: document.getElementById('random').checked,
        letter: document.getElementById('letter').checked,
        pron: document.getElementById('pron').checked
    }
    
    if (!checkbox.letter && !checkbox.pron) {
        alert('글자 맞추기, 발음 맞추기는 둘 중 1개를 반드시 포함해야 합니다.')
        return;
    }
    let seq = document.querySelector('input[name="sequence"]:checked').id;

    document.body.innerHTML = '';
    
    //seq 변수에 테스트 순서 덮어쓰기
    switch (seq) {
        case 'seq-random':
            seq = checkbox.random ? shuffle(Array.from({ length: keys.length * 10 }, (_, i) => i)) : Array.from({ length: keys.length * 10 }, (_, i) => i);
            break;
            
        case 'seq-letter':
            // 랜덤 맞추기 체크 여부에 따라 다르게 설정해야 함
            seq = checkbox.random ? shuffle(Array.from({ length: keys.length * hiragana[keys[0]][0].length }, (_, i) => i)) : Array.from({ length: keys.length * hiragana[keys[0]][0].length }, (_, i) => i);
            if (checkbox.pron) {
                seq = seq.concat(checkbox.random ? shuffle(Array.from({ length: keys.length * hiragana[keys[0]][0].length }, (_, i) => i+keys.length * hiragana[keys[0]][0].length)) : Array.from({ length: keys.length * hiragana[keys[0]][0].length }, (_, i) => i+keys.length * hiragana[keys[0]][0].length));
            }
            
            break;
            
        case 'seq-pron':
            // 랜덤 맞추기 체크 여부에 따라 다르게 설정해야 함
            seq = checkbox.random ? shuffle(Array.from({ length: keys.length * hiragana[keys[0]][0].length }, (_, i) => i+keys.length * hiragana[keys[0]][0].length)) : Array.from({ length: keys.length * hiragana[keys[0]][0].length }, (_, i) => i+keys.length * hiragana[keys[0]][0].length);
            if (checkbox.letter) {
                seq = seq.concat(checkbox.random ? shuffle(Array.from({ length: keys.length * hiragana[keys[0]][0].length }, (_, i) => i)) : Array.from({ length: keys.length * hiragana[keys[0]][0].length }, (_, i) => i));
            }
            break;

        default:
            break;
    }
    
    let div = document.createElement('div');
    //몇 번째 문제 푸는 중인지 상단에 표시할 것
    
    let div2 = document.createElement('div');
    div2.style.textAlign = 'center';
    div2.style.height = '300px';
    document.body.appendChild(div2);

    let details = document.createElement('details');
    let summary = document.createElement('summary');
    summary.textContent = '답안지';
    let p = document.createElement('p');
    p.id = 'answer';
    
    let input = document.createElement('input');
    input.type = 'checkbox';
    input.id = 'keepOpen';
    let label = document.createElement('label');
    label.htmlFor = input.id;
    label.textContent = '열림 상태 유지(기본값: 닫힘)';
    div = document.createElement('div');
    div.append(input, label);
    
    details.append(summary, p, div);
    document.body.appendChild(details);

    function test() {
        if (history.length >= seq.length) {
            div2.innerHTML = `${0}점<br><small>(${0}/${seq.length})</small>`;
            document.body.removeChild(details);
            btn.textContent = '처음으로';
            btn.onclick = () => {
                location.href = '';
            };
            return;
        }

        if (!document.getElementById('keepOpen').checked) {
            details.open = false;
        }
        
        let Q = hiragana[keys[Math.floor(seq[history.length]/hiragana[keys[0]][0].length)%keys.length]][Math.floor(seq[history.length]/(keys.length*hiragana[keys[0]][0].length))][seq[history.length]%hiragana[keys[0]][0].length];
        
        if (Math.floor(seq[history.length]/(keys.length*hiragana[keys[0]][0].length))==1) {
            div2.style.fontSize = '100px';
            Q = Q.replace('(', '<br><small>(').replace(')', ')</small>');
        } else {
            div2.style.fontSize = '150px';
        }
        div2.innerHTML = Q;


        let A = hiragana[keys[Math.floor(seq[history.length]/hiragana[keys[0]][0].length)%keys.length]][Math.abs(Math.floor(seq[history.length]/(keys.length*hiragana[keys[0]][0].length))-1)][seq[history.length]%hiragana[keys[0]][0].length]
        document.getElementById('answer').innerHTML = A;

        
        
        if (Q.length==0) {
            //skip
            history.push('');
            console.log('skip');
            
            test();
        }
    }
    test();




    let btn = document.createElement('button');
    btn.textContent = '다음 문제';
    btn.onclick = () => {
        history.push('');
        test();
    };
    btn.style.position = 'fixed';
    btn.style.left = '50%';
    btn.style.transform = 'translateX(-50%)';
    btn.style.bottom = 0;
    
    document.body.appendChild(btn);
}

/**
 * Fisher-Yates 알고리즘으로 배열 섞기
 * @param {*} arr
 */
function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        // 랜덤 인덱스 선택
        const j = Math.floor(Math.random() * (i + 1));
        // 요소 교환
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}