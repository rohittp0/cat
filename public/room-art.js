export const roomArt = String.raw`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 620" fill="none" aria-hidden="true" focusable="false">
  <defs>
    <pattern id="wall-dots" width="36" height="36" patternUnits="userSpaceOnUse"><circle cx="4" cy="4" r="1" fill="#CEAA85" opacity=".2"/></pattern>
    <pattern id="rug-lines" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(-8)"><path d="M0 6h12" stroke="#ED9E8F" stroke-width="1" opacity=".5"/></pattern>
    <clipPath id="window-clip"><path d="M639 253V156a78 78 0 0 1 156 0v97Z"/></clipPath>
  </defs>

  <!-- A tiny room with a very important tenant. -->
  <path fill="var(--room-wall, #FFF3DD)" d="M0 0h900v620H0z"/>
  <path fill="url(#wall-dots)" d="M0 0h900v460H0z"/>
  <path fill="var(--room-floor, #EED5B2)" d="M0 461h900v159H0z"/>
  <path d="M0 460h900M0 477h900" stroke="#CBA887" stroke-width="3"/>
  <g stroke="#D4B694" stroke-width="2" opacity=".55"><path d="M80 477 20 620M268 477l-24 143M453 477v143M638 477l25 143M822 477l60 143M0 571h900"/><path d="M180 524h85m320 0h76M51 596h88m470-1h87"/></g>

  <!-- Sun-dappled arched window. -->
  <path d="M628 263V157a89 89 0 0 1 178 0v106Z" fill="#EAC5A4" stroke="#916B50" stroke-width="4"/>
  <path class="window-sky" d="M639 253V156a78 78 0 0 1 156 0v97Z" fill="var(--window-sky, #D8E8DD)"/>
  <g clip-path="url(#window-clip)">
    <g class="room-sun"><circle cx="753" cy="133" r="24" fill="#F3C366"/><path d="m753 99 1-6m24 17 5-4m-63 4 5 4m57 19h7m-70 21-5 3" stroke="#E9B858" stroke-width="3" stroke-linecap="round"/></g>
    <path class="room-moon" d="M769 112c-22 3-30 32-12 46-26 6-45-21-29-42 8-11 22-13 32-8Z" fill="#FFE6A6"/>
    <g class="window-cloud" fill="#FFFCED"><path d="M617 183c0-12 12-19 22-15 3-22 34-25 42-5 16-5 30 6 29 20Z"/><path d="M742 223c-3-10 4-20 15-20 2-17 26-20 32-4 14-4 25 7 24 20Z"/></g>
    <path d="M635 247c30-26 50-14 69-6 24-28 64-30 94-5v22H635Z" fill="#B7C9A1"/>
  </g>
  <path d="M717 80v173m-78-69h156" stroke="#916B50" stroke-width="4"/>
  <path d="M622 263h190v12H622z" fill="#F1D6B6" stroke="#916B50" stroke-width="4" stroke-linejoin="round"/>
  <path d="M628 99c-7 44-11 97-3 148m180-148c7 44 11 97 3 148" stroke="#FFFCED" stroke-width="14" stroke-linecap="round"/>

  <!-- Favorite books, one trailing plant, and a little picture. -->
  <g stroke="#8F6850" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M111 228h215v13H111z" fill="#D3A57B"/><path d="M131 243v15m176-15v15"/>
    <path d="M138 164h24v64h-24z" fill="#DCA59A"/><path d="M164 153h20v75h-20z" fill="#9FB5A4"/><path d="m190 166 20-5 16 63-20 5Z" fill="#F1CC7D"/>
    <path d="M143 176h14m11-8h12m-36 45h13m11 0h12m22-34 11-3" stroke-width="2"/>
    <path d="m254 191 7 37h39l7-37Z" fill="#CF8871"/>
    <path d="M251 191h59v9h-59z" fill="#E5A189"/>
    <path d="M280 190v-48m0 29c-1-20-26-26-26-26-3 21 13 30 26 26Zm1-17c0-21 23-31 23-31 7 21-8 31-23 31Zm3 36c15-6 26-2 29 11 3 12-7 24-4 38 2 13 13 14 16 25" stroke="#77977C"/>
    <path d="M316 219c-14-4-18-14-18-14 14-5 22 1 18 14Zm-7 21c11-6 21-2 21-2-3 12-12 16-21 2Zm16 25c-12 0-17-8-17-8 11-8 20-3 17 8Z" fill="#8BA786" stroke="#77977C"/>
    <path d="M132 304h73v86h-73z" fill="#F5D5AD" transform="rotate(-5 168 348)"/>
    <path d="M142 315h52v63h-52z" fill="#FFFAE9" transform="rotate(-5 168 348)" stroke-width="2"/>
    <path d="M156 353c-14-14 0-28 11-17 8-14 25-3 16 11l-14 18Z" fill="#DCA69A" stroke-width="2.5"/>
  </g>

  <g fill="#E7BD79" opacity=".7"><path d="m536 127 4 9 10 3-10 4-4 10-4-10-10-4 10-3Z"/><path d="m102 108 3 6 7 3-7 2-3 7-2-7-7-2 7-3Z"/></g>

  <!-- Woven rug. -->
  <ellipse cx="463" cy="523" rx="279" ry="67" fill="#E3A391"/>
  <ellipse cx="463" cy="520" rx="260" ry="53" fill="#F2BCAB"/>
  <ellipse cx="463" cy="520" rx="260" ry="53" fill="url(#rug-lines)"/>
  <ellipse cx="463" cy="520" rx="244" ry="44" stroke="#FFE0C6" stroke-width="2"/>
  <g stroke="#CD8E7E" stroke-width="3" stroke-linecap="round"><path d="m194 507-14-3m14 18-18 1m20 15-14 4m547-35 14-3m-14 18 18 1m-20 15 14 4"/></g>

  <!-- Bits and bobs at floor level. -->
  <g stroke="#8B604A" stroke-linecap="round" stroke-linejoin="round">
    <g transform="rotate(-12 247 493)" stroke-width="3"><circle cx="247" cy="493" r="28" fill="#B4BDA0"/><path d="M229 473c22 11 35 29 34 41m-43-19c20-4 38 2 51 13m-26-42c-14 16-17 34-13 53m21-51c8 13 7 33-3 51m-20-40c7 1 16-1 20-10" stroke="#87977A" stroke-width="2"/><path d="M222 507c-26-1-39 7-33 18 5 10 23 6 22-1-1-6-12-4-14 1" fill="none" stroke="#87977A"/></g>
    <g stroke-width="3"><path d="M113 510h77l-9 26h-59Z" fill="#DBA298"/><ellipse cx="151" cy="510" rx="39" ry="8" fill="#EFD5BC"/><ellipse cx="151" cy="511" rx="29" ry="4" fill="#AB805A"/><path d="m144 525 5 3 7-5" stroke="#FBE5D1"/></g>
    <path d="M739 438h64l-9 72h-46Z" fill="#C98F78" stroke-width="3.5"/><path d="M735 438h72v13h-72z" fill="#D9A18A" stroke-width="3.5"/>
    <g stroke="#789172" stroke-width="3.5"><path d="M770 438v-64m3 48 22-28m-24 17-22-28"/><path d="M770 409c-23 0-32-15-27-32 18 0 29 13 27 32Zm5-5c1-23 16-34 30-28 0 17-13 29-30 28Z" fill="#A4B18B"/><path d="M772 383c-17-11-18-31-5-40 16 10 18 26 5 40Z" fill="#91A77F"/></g>
    <g stroke="#D6AC61" stroke-width="2"><circle cx="767" cy="351" r="8" fill="#F1CF82"/><circle cx="804" cy="377" r="7" fill="#F1CF82"/></g>
  </g>
  <g fill="#996E53" opacity=".3"><ellipse cx="770" cy="516" rx="42" ry="7"/><ellipse cx="150" cy="539" rx="42" ry="4"/></g>
</svg>`;

export const catArt = String.raw`<svg xmlns="http://www.w3.org/2000/svg" viewBox="330 180 310 350" fill="none" aria-hidden="true" focusable="false">
  <ellipse class="cat-shadow" cx="465" cy="519" rx="109" ry="10" fill="#A96E55" opacity=".17"/>
  <!-- The resident. All the important bits have animation hooks. -->
  <g class="cat-character" stroke="#79503F" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
    <g class="cat-tail">
      <path d="M552 455c53 4 79-18 72-44-6-21-30-23-41-9-12 16 4 25 11 17-3 18-28 21-48 16" fill="#E5A16F"/>
      <path d="M596 394c-8 5-12 13-10 21m32-15c-5 11-12 17-20 19m28 13-20-6" stroke="#C88456" stroke-width="8"/>
    </g>
    <g class="cat-body">
    <path d="M403 344c-28 23-44 74-38 124 3 32 32 46 99 46 69 0 98-14 99-48 2-50-14-102-41-122Z" fill="#E8A775"/>
    <path d="M438 368c-28 28-42 74-27 117 8 21 29 28 53 28 25 0 47-6 54-26 15-41 0-91-27-119Z" fill="#F5D5A9" stroke="none"/>
    <path d="m380 395 20 8m-27 22 23 5m151-35-19 8m26 22-22 6" stroke="#C88558" stroke-width="9"/>
    </g>
    <g class="cat-paw-left">
      <path d="M400 447c-3 20-8 41-3 53"/>
      <path d="M397 486c-19-2-27 12-20 23 5 9 30 12 49 7 11-3 9-21-1-25" fill="#F0BE8B"/>
      <path d="M391 502v10m12-9v11" stroke-width="2.5"/>
    </g>
    <g class="cat-paw-right">
      <path d="M528 447c3 20 8 41 3 53"/>
      <path d="M526 486c19-2 27 12 20 23-5 9-30 12-49 7-11-3-9-21 1-25" fill="#F0BE8B"/>
      <path d="M524 502v10m12-9v8" stroke-width="2.5"/>
    </g>
    <g id="cat-head" class="cat-head">
      <path d="M368 266c-14-27-19-61-7-76 17 0 41 17 56 39 28-10 62-10 91 0 15-22 39-39 56-39 12 15 7 49-7 76 13 16 20 36 18 58-3 47-46 75-112 75s-110-28-113-75c-1-22 5-42 18-58Z" fill="#EDB47E"/>
      <path class="cat-ear-left" d="M376 244c-7-12-11-28-9-36 12 5 24 15 31 26" fill="#D98D79" stroke="none"/>
      <path class="cat-ear-right" d="M527 234c7-11 19-21 31-26 2 8-2 24-9 36" fill="#D98D79" stroke="none"/>
      <path d="m442 235 7 22m15-24v25m16-23-6 22" stroke="#C88558" stroke-width="9"/>
      <path d="M359 293 378 298m-20 14 18 1m188-20-18 5m19 14-18 1" stroke="#C88558" stroke-width="7"/>
      <ellipse cx="407" cy="341" rx="19" ry="11" fill="#DC9181" stroke="none" opacity=".65"/>
      <ellipse cx="519" cy="341" rx="19" ry="11" fill="#DC9181" stroke="none" opacity=".65"/>
      <g class="cat-eyes-open" fill="#684535" stroke="none"><ellipse cx="415" cy="317" rx="7" ry="10"/><ellipse cx="510" cy="317" rx="7" ry="10"/><circle cx="417" cy="313" r="2" fill="#FFF7E8"/><circle cx="512" cy="313" r="2" fill="#FFF7E8"/></g>
      <g class="cat-eyes-happy"><path d="M404 321c5-8 15-8 21 0m74 0c5-8 15-8 21 0"/></g>
      <path d="M455 331q8-5 16 0l-8 8Z" fill="#AA6D61" stroke="#AA6D61" stroke-width="2"/>
      <path d="M463 338v7m0-1c-5 11-16 10-20 4m20-4c5 11 16 10 20 4" stroke-width="3"/>
      <path d="m392 340-33-4m32 14-32 7m176-17 33-4m-32 14 32 7" stroke-width="2.5"/>
    </g>
    <path d="M425 385c23 8 53 8 76 0" stroke="#9BAF8C" stroke-width="10"/>
    <circle cx="463" cy="399" r="11" fill="#E8BD64" stroke-width="2.5"/>
    <path d="M463 401v4m-4-5h8" stroke-width="2"/>
  </g>
</svg>`;
