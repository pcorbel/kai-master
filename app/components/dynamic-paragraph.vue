<template>
  <!-- Illustration -->
  <v-img
    v-if="paragraph.type === 'image' && paragraph.image"
    class="mx-auto"
    :alt="paragraph.image.alt"
    :src="paragraph.image.src"
    max-height="480"
  />

  <!-- Enemy stats, opens the combat tracker -->
  <combat-link v-else-if="paragraph.type === 'combat' && paragraph.combat" :enemy="paragraph.combat" />

  <!-- Table (price lists…) -->
  <v-table v-else-if="paragraph.type === 'table'" class="bg-background" density="compact">
    <tbody>
      <tr v-for="(row, rowIndex) in paragraph.rows" :key="rowIndex">
        <component
          :is="row.header ? 'th' : 'td'"
          v-for="(cell, cellIndex) in row.cells"
          :key="cellIndex"
          class="text-left"
        >
          {{ cell }}
        </component>
      </tr>
    </tbody>
  </v-table>

  <!-- Everything else is inline runs -->
  <div v-else :id="paragraph.footnote ? `footnote-${paragraph.footnote}` : undefined" :class="paragraphClass">
    <span v-if="paragraph.marker" class="marker">{{ paragraph.marker }}</span>
    <span :class="{ 'flex-grow-1': paragraph.marker }">
      <template v-for="(run, index) in paragraph.runs" :key="index">
        <br v-if="run.kind === 'line-break'" />
        <turn-to-link v-else-if="run.kind === 'section-link'" :number="run.section" :text="run.text" />
        <action-chart-link v-else-if="run.kind === 'action-chart-link'" :text="run.text" />
        <random-number-table-link v-else-if="run.kind === 'random-number-link'" :text="run.text" />
        <a
          v-else-if="run.kind === 'footnote-ref'"
          class="footnote-ref text-primary"
          :href="`#footnote-${run.footnote}`"
          @click.prevent="scrollToFootnote(run.footnote)"
        >
          <sup>{{ run.text }}</sup>
        </a>
        <span v-else :class="runClass(run)">{{ run.text }}</span>
      </template>
    </span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  paragraph: Paragraph;
}>();

const PARAGRAPH_CLASSES: Partial<Record<ParagraphType, string>> = {
  "header-1": "text-h4 font-weight-black",
  "header-2": "text-h5 font-weight-bold",
  "header-3": "text-h6 font-weight-bold",
  deadend: "font-italic font-weight-bold text-center",
  signpost: "signpost text-center font-italic",
  poetry: "font-italic pl-4",
  footnote: "footnote text-body-2 text-medium-emphasis",
  "list-item": "d-flex",
};

const paragraphClass = computed(() => PARAGRAPH_CLASSES[props.paragraph.type] ?? "");

function runClass(run: InlineRun): string {
  if (run.kind !== "text") return "";
  switch (run.style) {
    case "em":
      return "font-italic";
    case "strong":
      return "font-weight-bold";
    case "smallcaps":
      return "smallcaps";
    default:
      return "";
  }
}

function scrollToFootnote(id: string) {
  document.getElementById(`footnote-${id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
}
</script>

<style scoped>
.marker {
  flex: 0 0 auto;
  min-width: 1.5em;
}
.signpost {
  border: 1px solid rgb(var(--v-theme-border));
  border-radius: 4px;
  padding: 8px 12px;
}
.footnote {
  border-top: 1px solid rgb(var(--v-theme-border));
  padding-top: 8px;
}
.footnote-ref {
  text-decoration: none;
}
.smallcaps {
  font-size: 0.92em;
  letter-spacing: 0.03em;
}
</style>
