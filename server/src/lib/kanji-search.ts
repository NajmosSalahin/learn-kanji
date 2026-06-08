import Fuse from "fuse.js";
import { Kanji } from "../models/kanji.model.js";
import { readingsToRomaji } from "./romaji.js";

interface SearchDoc {
  character: string;
  strokes: number;
  grade: number | null;
  freq: number | null;
  jlpt_new: number | null;
  meanings: string[];
  readings_on: string[];
  readings_kun: string[];
  name_readings: string[];
  readings_on_romaji: string[];
  readings_kun_romaji: string[];
  name_readings_romaji: string[];
}

let fuse: Fuse<SearchDoc> | null = null;

export async function initKanjiSearch() {
  if (fuse) return;
  const raw = await Kanji.find({})
    .select("character strokes grade freq jlpt_new meanings readings_on readings_kun name_readings")
    .lean();
  const allKanji: SearchDoc[] = raw.map((d) => ({
    character: d.character,
    strokes: d.strokes,
    grade: d.grade,
    freq: d.freq,
    jlpt_new: d.jlpt_new,
    meanings: d.meanings,
    readings_on: d.readings_on,
    readings_kun: d.readings_kun,
    name_readings: d.name_readings,
    readings_on_romaji: readingsToRomaji(d.readings_on),
    readings_kun_romaji: readingsToRomaji(d.readings_kun),
    name_readings_romaji: readingsToRomaji(d.name_readings),
  }));
  fuse = new Fuse(allKanji, {
    keys: [
      { name: "character", weight: 2 },
      { name: "meanings", weight: 1 },
      { name: "readings_on", weight: 1.5 },
      { name: "readings_kun", weight: 1.5 },
      { name: "name_readings", weight: 1 },
      { name: "readings_on_romaji", weight: 1.5 },
      { name: "readings_kun_romaji", weight: 1.5 },
      { name: "name_readings_romaji", weight: 1 },
    ],
    threshold: 0.4,
    includeScore: true,
    findAllMatches: true,
    shouldSort: true,
  });
}

export function searchKanji(
  query: string,
  filters?: { jlpt?: string; grade?: string; strokes?: string },
) {
  if (!fuse) throw new Error("Search index not initialized");

  let results = fuse.search(query);

  if (filters?.jlpt) {
    if (filters.jlpt === "other") {
      results = results.filter(
        (r) => r.item.jlpt_new === null || r.item.jlpt_new === 0,
      );
    } else {
      const n = parseInt(filters.jlpt);
      if (n >= 1 && n <= 5) results = results.filter((r) => r.item.jlpt_new === n);
    }
  }

  if (filters?.grade) {
    if (filters.grade === "other") {
      results = results.filter(
        (r) => r.item.grade === null || r.item.grade === 0,
      );
    } else {
      const n = parseInt(filters.grade);
      if (n >= 1 && n <= 8) results = results.filter((r) => r.item.grade === n);
    }
  }

  if (filters?.strokes) {
    const n = parseInt(filters.strokes);
    if (n >= 1 && n <= 30) results = results.filter((r) => r.item.strokes === n);
  }

  return results;
}
