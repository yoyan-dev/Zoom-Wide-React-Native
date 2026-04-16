import { type CategoryTile, type TradeBenefit } from "./types";

export const catalogCategories: CategoryTile[] = [
  {
    id: "cement",
    title: "Cement",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA4AT-KVl22bNx0eg86gx3Y8zmG0QnoW6pT71-B7JxJ2aouVg5edSKCQa3TIQBqirdJj0WdBq-2VQrhwhy52umudoM5rpdYuteK-iit6qC2fWnjXPkfA7ls6FQonxrjqUluhrFtjQuFyk6cxLoj8l0OuH3GZw0PAJyimahqON29gJouwATDz9c8lrmGk5X-HMS3xx_1rgau-SLVPURIIZpLYRhnMvrbieIGoGvd2fZpANOWwbSYfsXvxX7lMEDjhWDKvmU9Wb_NKO8",
  },
  {
    id: "steel-bars",
    title: "Steel Bars",
    subtitle: "Grade 60 Structural",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDQfcql-jRtkIsCR3rWG12o1qa7lICnKdOpeePJpn4UqzfUUr0p53AVg0lfBRIeZs3a9qDyxaCqJsaaHeWwHZ27kRuEwvqIIbdRGBhEL3EV7yw3M05lSrxBvNrAXLTvRboMBRwWTUJ0VOHqF7Gy0mVwluRP7zQ_vuo8GVL7YqT0oXAHr8d93Grb9Z3SLp7hPY_upXRtrr9li_MoDnQ1lwgQIhxRDXqx6utG32dlm1rP2lIvEFOS-uPhZALR2Tfm6lz-P5SsmMDcmYQ",
    size: "wide",
  },
  {
    id: "sand-gravel",
    title: "Sand & Gravel",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBRGhF0J5mdfrM0mTYSZpwxYARlpqEUjPfanTSGNtyh7NnJSgwo0jT4lCzeHg2pBMY-6X5Rqh_SpcTzFwAjCfd__-MUL4k2VfNeDT9Sz7eJhttn6ipEfRXOcHHy3zz42KJTuRzBZ8dltPy5S5ZhykR0N_T2kRt8HVlfyuMoxMy3Cgub6tRrG1PjMF9F1Z4sZRRNETiFzd36OUmu1k-Lx8xjjKorUMnaTYo8N3M5Z4Da2_zTViJP2eMxaJr_00Huk4bbVuNF50Fr1Og",
  },
  {
    id: "hollow-blocks",
    title: "Hollow Blocks",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCTY4MTqJqHqmhJFcaYcUt7Gy0MrIL9ru7Y7ABQ4tmsJIWe4YbSW8A868owxpwlXwK_sJ8YpcFuivyrzENoS_3WNWn0WC8LRWANRgKf94h6-JfaHIBxFRLGwP6Gz0Gll-Mt7eU7G_I_wd1M-dCy2QWuUZHdB5m6lVvUhBHArjDG8nuIoJ5ze8k-6f54P1cN-6WjY11BGDFMHrinWAIRd2jy9j36fkOi_fjFNWI_uZGpEcPg8IUlPVoDHD85a578LSDjO28mbeVKCc8",
  },
  {
    id: "pipes",
    title: "Pipes",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCRf01NiTAVQydXvNBxpRC9RASN8B5TRqvc3hotWL_is1Eb7dsOCuJ3Vsy3lAJbMwAhvJU8w3AcKNpLPSyTaTSXcaXbpGjk4U4lPqZgHpx8W4gIRMs2csv3lwGu2YQx7i5J7l8qoubExn5foZncP4SoqQ9C-8Gk5vyj8mZpAVPM-2_L8bMKnYgZ-Hq4BQ0WxXN-R7QxH3KtCFaLXYzGiVJOIpLFpWKrdn5f-bUDSmMzdLp_MdqVGppI8nuH5V-TLdl9dzwD1e9lEMs",
  },
  {
    id: "paint",
    title: "Paint",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCbLXghPX6rcN-7h7WKnY05ryU3YcrpZTSitfgV1tRaByjaCMcLpbDWWKaYtXmPcqzXcbRcD0Yl_O6NHSfHWzWK9tKTdB0m-xvFYRfMZTaN8Ybe5GqTZ4FZ4YAljmxFGM8YYVkC9OX4g5iN6jjnn6b15yQ5ZfO341EPX2yL2B_ZutOZHkqaa0R2uoFa0pXG1DTXIroV70K8Y2qBrPBq1gnaHxbZhEnk3bjxDCaa90Mfws4fhwCQCaqv51o9kOi1FbnxTQeno_EqH4k",
  },
  {
    id: "electrical",
    title: "Electrical",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuApW1h9JF9vsh2IKjqbnOo4_fjc-MsMQ9rL4rsf_eeEnBjBX-AOfc8nVXdAKvL6G4J_i2bepPMaOrIA85fPfT_CWqDZNZDd-Ks115g_yocfYxEZ5W6YU21EQ0bXTEpPkSzfEs4klRgBAYH4gJBVq4hUvO8f_s38GlgwqEll-UDrHKUjs-6tSxpp2SZ_Uo6fvHqk7XQ5DH7pb4wCyZCJqdjBBa3Jgxx0ypZHFlw8UWQZDAWX50FBkUnG_wL_IUv_38wgL-PLQLaJ4sg",
  },
  {
    id: "hardware-tools",
    title: "Hardware Tools",
    subtitle: "Professional Spec",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCMXIdoi1sEhcg70h_DT-qskZIXkIPDCtIQ6-BLyfCEllKNyfxS0sk8lkNHbMaRfreEuL9fk32HUHtHoiYqlAskL1TDwFx3xL6V5PSKo2G22d5q8oWivGR-3xn2F99bc4vu65MwkY_R7fqxfWi11xBi8dsf-XRFyYO9uiSrQ2476_dTwH7NlKOyN-Vs3uCQ3poKy2DZNSi4IUE82EOt2-BwbD1pO3vprIS7xYLrpesKD4ZNVedWKMUJClW5WxWmAqX33sn7JcIujdc",
    size: "tall",
  },
];

export const tradeBenefits: TradeBenefit[] = [
  { icon: "verified", label: "Certified Material Inspection" },
  { icon: "local-shipping", label: "On-Site Delivery Logistics" },
  { icon: "request-quote", label: "Tax-Exempt Transactions" },
];
