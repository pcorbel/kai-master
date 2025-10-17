<template>
  <!-- Dynamic Paragraph -->
  <template v-for="(part, index) in parsedContent" :key="index">
    <component
      v-if="part.isComponent"
      v-bind="part.props"
      :is="components[part.componentName as keyof typeof components]"
    />

    <span v-else :class="getClass(content.type)">
      {{ part.text }}
    </span>
  </template>
</template>

<script setup lang="ts">
// Imports
import { computed } from "vue";
import { VImg } from "vuetify/components";
import actionChartLink from "@/components/action-chart-link.vue";
import combatLink from "@/components/combat-link.vue";
import randomNumberTableLink from "@/components/random-number-table-link.vue";
import turnToLink from "@/components/turn-to-link.vue";

// Define constants
const props = defineProps<{
  content: Paragraph;
}>();
const components = {
  "action-chart-link": actionChartLink,
  "combat-link": combatLink,
  "random-number-table-link": randomNumberTableLink,
  "turn-to-link": turnToLink,
  "v-img": VImg,
} as const;
const parsedContent = computed<ContentPart[]>(() => {
  const componentRegex = /<([a-z-]+)([^>]*)\/>/g;
  const parts: ContentPart[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = componentRegex.exec(props.content.text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({
        isComponent: false,
        text: props.content.text.slice(lastIndex, match.index),
      });
    }

    const componentName = match[1];
    const propsString = match[2]!.trim();
    const componentProps: Record<string, string> = {};

    if (propsString) {
      const propsRegex = /(\w+)="([^"]*)"/g;
      let propMatch: RegExpExecArray | null;
      while ((propMatch = propsRegex.exec(propsString)) !== null) {
        componentProps[propMatch[1]!] = propMatch[2] ?? "";
      }
    }

    parts.push({
      isComponent: true,
      componentName: componentName!,
      props: componentProps,
    });

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < props.content.text.length) {
    parts.push({
      isComponent: false,
      text: props.content.text.slice(lastIndex),
    });
  }

  return parts;
});

// Define functions
function getClass(type: string) {
  switch (type) {
    case "header-1":
      return "text-h4 font-weight-black";
    case "header-2":
      return "text-h5 font-weight-bold";
    case "header-3":
      return "text-h6 font-weight-bold";
    default:
      return "";
  }
}
</script>
