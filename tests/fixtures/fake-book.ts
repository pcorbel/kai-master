import JSZip from "jszip";

/**
 * Builds an in-memory zip that mimics the structure of a Project Aon book.
 * All prose is made up for the test; only the markup follows Project Aon.
 */
export const FAKE_CODE = "99test";

const PNG_1x1 = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
  "base64",
);
// A second, different payload so tests can tell sword.png from bsword.png apart.
const PNG_OTHER = Buffer.concat([PNG_1x1, Buffer.from([0])]);

const page = (body: string) => `<!DOCTYPE html>
<html><head><title>Test</title></head>
<body>
 <div class="container">
  <nav class="navbar navbar-dever"><ul class="nav navbar-nav"><li><a href="toc.htm">Table of Contents</a></li></ul></nav>
  <article>
   <header><h1>Test Book</h1></header>
   <div class="row">
    <div class="maintext table-responsive">
${body}
    </div>
    <p id="page-navigation">&lt; <a href="sect1.htm">Section 1</a></p>
   </div>
  </article>
 </div>
</body></html>`;

export const FAKE_FILES: Record<string, string> = {
  "dedicate.htm": page(`<h2>Dedication</h2>
      <p class="dedication">For every reader who kept a pencil handy.</p>`),
  "acknwldg.htm": page(`<h2>Acknowledgements</h2>
      <dl>
       <dt>Transcription</dt>
       <dd>First Helper<br/>Second Helper</dd>
      </dl>`),
  "tssf.htm": page(`<h2>The Story So Far&thinsp;&hellip;&thinsp;</h2>
      <p>You are a young warrior of the <cite>Northern Order</cite>, and the road ahead is long.</p>`),
  "gamerulz.htm": page(`<h2>The Game Rules</h2>
      <p>Pick a number from the <a href="random.htm">Random Number Table</a> and write it on your <a href="action.htm">Action Chart</a>.</p>`),
  "discplnz.htm": page(`<h3>Kai Disciplines</h3>
      <p>Choose five skills.</p>
      <h4><a id="camflage">Camouflage</a></h4>
      <p>Blend in with the crowd.</p>`),
  "equipmnt.htm": page(`<h3>Equipment</h3>
      <p>You also find one of the following:</p>
      <ul>
       <li>1 = Sword (Weapons)<br/>
        <br/>
        <figure>
         <a href="sword.png"><img alt="illustration" class="img-responsive" src="sword.png"/></a>
        </figure>
       </li>
       <li>2 = Rope (Backpack Items)<sup><a href="#equipmnt-1-foot" id="equipmnt-1">2</a></sup></li>
      </ul>`),
  "cmbtrulz.htm": page(`<h3>Rules for Combat</h3>
      <ol>
       <li>Add any bonus to your <span class="smallcaps">COMBAT SKILL</span>.<br/>
        <br/>
       </li>
       <li>Subtract the enemy's <span class="smallcaps">COMBAT SKILL</span>.</li>
      </ol>`),
  "levels.htm": page(`<h3>Levels of Kai Training</h3>
      <ol><li>Novice</li><li>Initiate&mdash;you start here</li></ol>`),
  "kaiwisdm.htm": page(`<h2>Kai Wisdom</h2>
      <p>Good luck. <a href="sect1.htm">Turn to 1</a>.</p>`),
  "map.htm": page(`<h2>Map of the Lastlands</h2>
      <figure>
       <a href="map.png"><img alt="[map]" class="img-responsive" src="map.png"/></a>
       <figcaption><a href="map.png">Map of the Lastlands</a></figcaption>
      </figure>`),
  "license.htm": page(`<h2>Project Aon License</h2>
      <p>License text.</p>`),
  "footnotz.htm": page(`<h2>Footnotes</h2>
      <div class="footnote">
       <p>[<a href="sect1.htm#sect1-1">1</a>]  (<a href="sect1.htm">Section 1</a>) You may keep the rope as a Backpack Item.</p>
      </div>
      <div class="footnote">
       <p>[<a href="equipmnt.htm#equipmnt-1">2</a>]  (<a href="equipmnt.htm">Equipment</a>) Rope takes one slot on your <a href="action.htm">Action Chart</a>.</p>
      </div>`),
  "sect1.htm": page(`<h3>1</h3>
      <p>The gate is shut. You lose 2 <span class="smallcaps">ENDURANCE</span> points; note this on your <a href="action.htm">Action Chart</a>.<sup>
        <a href="#sect1-1-foot" id="sect1-1">1</a>
       </sup> A rope lies nearby.</p>
      <figure>
       <a href="small1.png"><img alt="illustration" class="img-responsive" src="small1.png"/></a>
      </figure>
      <p class="combat">Cave Rat: <span class="smallcaps">COMBAT&nbsp;SKILL</span>&nbsp;9 &nbsp;&nbsp;<span class="smallcaps">ENDURANCE</span>&nbsp;12</p>
      <p class="combat">Iron Gate: <span class="smallcaps">COMBAT&nbsp;SKILL</span>&nbsp;13 &nbsp;&nbsp;<span class="smallcaps">ENDURANCE</span> (<span class="smallcaps">RESISTANCE</span> points)&nbsp;35</p>
      <div class="signpost">Northport&mdash;2 Miles<br/>Ferry&mdash;5 Miles</div>
      <blockquote class="poetry">Over the hill,<br/>under the moon.</blockquote>
      <table class="table table-condensed">
       <tr><th>Item</th><th>Price</th></tr>
       <tr><td>Rope</td><td>2 Gold Crowns</td></tr>
      </table>
      <ul class="unbulleted">
       <li>Rope</li>
       <li>Lantern <em>(lit)</em></li>
      </ul>
      <p>You once read about this place in <a href="../../lw/02fotw/sect79.htm">Book 2, Section 79</a>.</p>
      <p class="choice">If you wish to climb the gate, <a href="sect2.htm">turn to 2</a>.</p>
      <p class="choice">If you would rather wait, <a href="sect3.htm">turn to 3</a>.</p>`),
  "sect2.htm": page(`<h3>2</h3>
      <p>You climb over and drop into the yard.</p>
      <p class="deadend">Your journey ends here.</p>`),
  "sect3.htm": page(`<h3>3</h3>
      <p>You wait until dawn. <a href="sect2.htm">Turn to 2</a>.</p>`),
  // Navigation-only pages that the parser must ignore.
  "toc.htm": page(`<h2>Table of Contents</h2><ul><li><a href="sect1.htm">1</a></li></ul>`),
  "title.htm": page(`<h2>Title</h2><p>Publication data.</p>`),
};

export async function buildFakeBookZip(): Promise<Uint8Array> {
  const zip = new JSZip();
  const dir = `en/xhtml/lw/${FAKE_CODE}/`;
  for (const [name, html] of Object.entries(FAKE_FILES)) zip.file(dir + name, html);
  zip.file(dir + "sword.png", PNG_1x1);
  zip.file(dir + "bsword.png", PNG_OTHER);
  zip.file(dir + "small1.png", PNG_1x1);
  zip.file(dir + "map.png", PNG_1x1);
  return zip.generateAsync({ type: "uint8array" });
}

export const SWORD_DATA_URL = `data:image/png;base64,${PNG_1x1.toString("base64")}`;
