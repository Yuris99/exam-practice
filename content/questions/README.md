# Project CSV Questions

Put UTF-8 CSV files in this directory. Every `.csv` file whose name does not begin with `_` is validated and bundled into the application before `dev` and `build`.

1. Copy `_template.csv` to a new name such as `information-processing-2026.csv`.
2. Add one question per row and save the file as UTF-8 CSV.
3. Run `npm.cmd run dev` locally. Deployment builds run the same generator automatically.
4. Put local images in `public/questions/` and use paths such as `/questions/q001.png`.

Supported exam types are `WRITTEN_CBT` and `PRACTICAL_WRITTEN_RESPONSE`. CBT answers use a 1-based `correct_answer`. Practical questions require `model_answer`; separate key points with `|`, comma, or semicolon. Separate tags and additional image paths with `|`.

Rich content columns:

- `reference_text`: a passage, condition, table-like text, or `[보기]` block. Use real line breaks inside a quoted CSV cell.
- `code_snippet`: source code without Markdown fences; set `code_language` when known.
- `image_url`: the primary image URL or a path below `public/`, such as `/questions/q001.png`.
- `image_urls`: additional images separated with `|`, up to six images total.
- `certificate_id`: use a stable identifier such as `information-processing-engineer` or `embedded-engineer`.

See `AI_IMPORT_PROMPT.md` for an English prompt that can be given to another AI, or `AI_IMPORT_PROMPT.ko.md` for Korean.

Files beginning with `_`, including `_template.csv`, are ignored. Invalid rows stop the build and report their filename and row number.
