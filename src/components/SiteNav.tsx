import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, useAnimationFrame } from "motion/react";
import { useTranslation } from "react-i18next";
import { cn } from "@/utils/styles";
import { useMorphingShape } from "@/hooks/useMorphingShape";
import { FlusoText } from "@/components/FlusoWordmark";

const BREAKPOINT = 768;

type IndustryKey =
  | "founders"
  | "lawyers"
  | "investors"
  | "marketers"
  | "researchers"
  | "doctors"
  | "consultants"
  | "sales"
  | "operations";

const INDUSTRY_LINKS: { href: string; key: IndustryKey }[] = [
  { href: "/for-founders", key: "founders" },
  { href: "/for-lawyers", key: "lawyers" },
  { href: "/for-investors", key: "investors" },
  { href: "/for-marketers", key: "marketers" },
  { href: "/for-researchers", key: "researchers" },
  { href: "/for-doctors", key: "doctors" },
  { href: "/for-consultants", key: "consultants" },
  { href: "/for-sales", key: "sales" },
  { href: "/for-operations", key: "operations" },
];

const TOP_LINKS: { href: string; key: "pricing" | "enterprise"; soon?: boolean }[] = [
  { href: "/pricing", key: "pricing" },
  { href: "/enterprise", key: "enterprise" },
];

const IconChevron = ({
  size = 12,
  className,
}: {
  size?: number;
  className?: string;
}) => (
  <svg
    viewBox="0 0 12 12"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
  >
    <path d="M3 4.5l3 3 3-3" />
  </svg>
);

const IconMenu = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    width="22"
    height="22"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    aria-hidden="true"
    className={className}
  >
    <line x1="4" y1="9" x2="20" y2="9" />
    <line x1="4" y1="15" x2="20" y2="15" />
  </svg>
);

const IconClose = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    width="22"
    height="22"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    aria-hidden="true"
    className={className}
  >
    <line x1="6" y1="6" x2="18" y2="18" />
    <line x1="18" y1="6" x2="6" y2="18" />
  </svg>
);

const PREM_TEXT_PATHS = [
  "M10.1471 2.17318C9.69173 1.77586 9.15269 1.48017 8.5393 1.27689C7.93521 1.0736 7.27535 0.971962 6.57832 0.971962H0.323608V15.1464H2.34036V10.1936H6.57832C7.27535 10.1936 7.93521 10.092 8.5393 9.88872C9.1434 9.68544 9.68244 9.38052 10.1471 8.99243C10.6118 8.5951 10.9743 8.10537 11.2252 7.54172C11.4854 6.96883 11.6155 6.31278 11.6155 5.59205C11.6155 4.86207 11.4854 4.20602 11.2252 3.64237C10.9743 3.06024 10.6118 2.57051 10.1471 2.17318ZM2.34036 2.75531H6.57832C7.47052 2.75531 8.20473 3.01404 8.76235 3.52225C9.31998 4.03046 9.59879 4.72347 9.59879 5.58281C9.59879 6.41442 9.31998 7.09819 8.76235 7.62488C8.20473 8.14233 7.47052 8.4103 6.57832 8.4103H2.34036V2.75531Z",
  "M25.7142 7.74501C26.0952 7.44008 26.3926 7.07047 26.5971 6.62694C26.8109 6.18342 26.9131 5.64749 26.9131 5.03764C26.9131 4.1321 26.7086 3.37441 26.309 2.77379C25.9094 2.17318 25.3239 1.72042 24.5804 1.41549C23.8369 1.1198 22.9261 0.971962 21.8759 0.971962H15.1844V15.1464H17.2011V9.41747H21.4205C22.2476 9.41747 22.9168 9.48216 23.3908 9.62076C23.8554 9.75012 24.1807 9.97188 24.3759 10.2768C24.5711 10.5817 24.6733 11.0253 24.6733 11.5797V15.1556H26.69V11.5797C26.69 10.7296 26.5228 10.0828 26.1882 9.64848C25.8536 9.22343 25.3796 8.91851 24.7848 8.75218C24.5153 8.67826 24.2179 8.62282 23.9019 8.57662C24.0692 8.53966 24.2365 8.49346 24.3852 8.44726C24.8963 8.28093 25.3424 8.04993 25.7142 7.74501ZM17.2104 2.75531H21.8852C22.9075 2.75531 23.6696 2.9586 24.1714 3.34668C24.664 3.73477 24.9056 4.30766 24.9056 5.03764C24.9056 5.79533 24.6547 6.42366 24.1621 6.90415C23.6696 7.38464 22.8982 7.62488 21.8852 7.62488H17.2104V2.75531Z",
  "M32.8613 8.98319H40.0175V7.1906H32.8613V2.75531H41.6068V0.971962H30.8446V15.1464H41.6253V13.3538H32.8613V8.98319Z",
  "M60.3147 0.971962L53.9206 13.132L47.5358 0.971962H45.5562V15.1464H47.5637V5.17624L52.9541 15.1464H54.8965L60.2868 5.15776V15.1464H62.2943V0.971962H60.3147Z",
] as const;

export const PremTextLogo = ({
  className,
  draw = false,
  active = true,
  delay = 0,
}: {
  className?: string;
  draw?: boolean;
  active?: boolean;
  delay?: number;
}) => {
  return (
    <svg
      width="43"
      height="16"
      viewBox="0 0 63 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("overflow-visible", className)}
    >
      {PREM_TEXT_PATHS.map((d, index) =>
        draw ? (
          <motion.path
            key={d}
            d={d}
            fill="currentColor"
            initial={{
              opacity: 0,
              y: 3,
              scale: 0.985,
            }}
            animate={
              active
                ? {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                  }
                : {
                    opacity: 0,
                    y: 3,
                    scale: 0.985,
                  }
            }
            transition={{
              duration: active ? 1 : 0.25,
              delay: active ? delay + index * 0.16 : 0,
              ease: active ? [0.16, 1, 0.3, 1] : [0.4, 0, 1, 1],
            }}
            style={{
              transformBox: "fill-box",
              transformOrigin: "center",
              willChange: "opacity, transform",
            }}
          />
        ) : (
          <path key={d} d={d} fill="currentColor" />
        ),
      )}
    </svg>
  );
}

export const IconPrem = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 313 324"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    className={className}
  >
    <path d="M142.718 193.594C143.919 196.599 146.625 198.759 149.844 199.282L150.11 199.325C153.404 199.86 156.736 198.61 158.846 196.047C160.958 193.482 161.52 189.987 160.325 186.896C159.126 183.794 156.339 181.559 153.025 181.049L152.915 181.032C149.572 180.518 146.188 181.849 144.088 184.477C142.032 187.052 141.497 190.542 142.718 193.594Z" fill="currentColor" />
    <path d="M188.125 182.474C190.117 180.026 190.606 176.671 189.424 173.753C188.279 170.924 185.726 168.852 182.695 168.326L182.538 168.299C179.359 167.747 176.131 168.961 174.121 171.462C172.197 173.856 171.682 177.081 172.757 179.949C173.861 182.895 176.476 185.038 179.605 185.552L179.858 185.594C182.98 186.107 186.139 184.915 188.125 182.474Z" fill="currentColor" />
    <path d="M191.884 146.539C190.817 143.792 188.375 141.798 185.449 141.287L185.112 141.228C182.096 140.701 179.026 141.818 177.072 144.155C175.072 146.547 174.567 149.849 175.747 152.727C176.903 155.546 179.499 157.551 182.543 157.959L182.672 157.977C185.627 158.373 188.602 157.196 190.496 154.914C192.434 152.579 192.98 149.361 191.884 146.539Z" fill="currentColor" />
    <path d="M168.824 137.781C170.919 135.189 171.462 131.649 170.206 128.571C168.992 125.595 166.298 123.464 163.101 122.949L162.907 122.918C159.55 122.377 156.146 123.699 154.035 126.341C151.985 128.908 151.45 132.379 152.654 135.428C153.86 138.481 156.614 140.668 159.884 141.17L160.023 141.192C163.349 141.702 166.72 140.383 168.824 137.781Z" fill="currentColor" />
    <path d="M142.272 137.973C141.19 135.012 138.581 132.858 135.445 132.338L135.317 132.317C132.174 131.796 128.969 133.002 126.946 135.442C124.907 137.9 124.362 141.287 125.556 144.24C126.735 147.158 129.409 149.221 132.553 149.639L132.707 149.659C135.805 150.071 138.91 148.822 140.86 146.401C142.769 144.029 143.314 140.826 142.272 137.973Z" fill="currentColor" />
    <path d="M128.503 159.606C125.523 159.184 122.539 160.343 120.642 162.658C118.692 165.039 118.192 168.284 119.331 171.135C120.475 173.996 123.131 176.034 126.209 176.446C129.158 176.841 132.159 175.688 134.058 173.418C135.996 171.102 136.561 167.919 135.516 165.094C134.435 162.172 131.82 160.075 128.711 159.635L128.503 159.606Z" fill="currentColor" />
    <path d="M99.8543 133.25C96.2904 133.903 93.3483 136.389 92.1346 139.773C90.8939 143.231 91.6709 147.104 94.1334 149.847C96.5158 152.5 100.142 153.745 103.667 153.099L103.975 153.042C107.556 152.386 110.511 149.885 111.724 146.484C112.964 143.006 112.185 139.13 109.701 136.383C107.325 133.756 103.734 132.539 100.233 133.181L99.8543 133.25Z" fill="currentColor" />
    <path d="M110.46 181.609C111.661 178.305 110.941 174.59 108.615 171.94C106.33 169.337 102.81 168.089 99.3818 168.695L99.0902 168.747C95.6359 169.358 92.7784 171.759 91.606 175.035C90.4146 178.364 91.183 182.109 93.5578 184.744C95.8706 187.31 99.4006 188.527 102.814 187.895L103.053 187.851C106.465 187.22 109.284 184.844 110.46 181.609Z" fill="currentColor" />
    <path d="M124.429 213.417C127.772 212.821 130.537 210.497 131.674 207.326C132.815 204.143 132.14 200.598 129.908 198.045C127.642 195.453 124.127 194.29 120.744 195.015L120.511 195.065C117.384 195.735 114.811 197.925 113.672 200.887C112.404 204.183 113.116 207.909 115.508 210.522C117.702 212.918 120.991 214.03 124.205 213.457L124.429 213.417Z" fill="currentColor" />
    <path d="M157.496 227.336C160.592 226.701 163.127 224.508 164.181 221.555C165.269 218.504 164.593 215.088 162.439 212.654C160.33 210.271 157.097 209.137 153.948 209.698L153.74 209.735C150.549 210.304 147.911 212.525 146.83 215.554C145.769 218.529 146.389 221.862 148.431 224.284C150.59 226.847 154.018 228.049 157.317 227.372L157.496 227.336Z" fill="currentColor" />
    <path d="M188.19 212.498C191.147 211.888 193.568 209.794 194.578 206.973C195.622 204.058 194.999 200.812 192.949 198.479L192.88 198.4C190.829 196.068 187.663 194.986 184.593 195.546C181.583 196.096 179.053 198.174 177.966 201.009C176.828 203.979 177.421 207.336 179.517 209.741C181.59 212.12 184.802 213.198 187.908 212.557L188.19 212.498Z" fill="currentColor" />
    <path d="M209.173 170.963C205.589 171.616 202.628 174.114 201.406 177.516C200.171 180.952 200.915 184.798 203.33 187.552C205.724 190.283 209.415 191.568 213.003 190.901L213.165 190.871C216.679 190.218 219.598 187.794 220.864 184.481C222.192 181.007 221.498 177.086 219.051 174.271C216.678 171.539 213.02 170.261 209.442 170.914L209.173 170.963Z" fill="currentColor" />
    <path d="M219.561 139.288C217.285 136.692 213.801 135.471 210.384 136.072L210.006 136.139C206.552 136.746 203.691 139.138 202.505 142.409C201.322 145.67 202.021 149.35 204.282 151.995C206.578 154.682 210.179 155.998 213.678 155.382L213.809 155.359C217.323 154.741 220.232 152.289 221.417 148.953C222.595 145.637 221.888 141.942 219.561 139.288Z" fill="currentColor" />
    <path d="M201.099 120.499C202.233 117.323 201.543 113.767 199.322 111.217C197.113 108.681 193.699 107.465 190.371 108.055L190.179 108.088C186.842 108.679 184.082 110.997 182.948 114.161C181.805 117.348 182.523 120.936 184.77 123.481C186.993 126 190.471 127.208 193.795 126.615C197.144 126.018 199.965 123.677 201.099 120.499Z" fill="currentColor" />
    <path d="M155.647 96.6296C152.467 97.1964 149.839 99.4134 148.768 102.434C147.7 105.447 148.345 108.796 150.458 111.208L150.538 111.299C152.661 113.722 155.914 114.859 159.101 114.291L159.223 114.269C162.425 113.698 165.068 111.462 166.139 108.419C167.206 105.383 166.518 101.983 164.379 99.5656C162.264 97.1755 159.015 96.0294 155.857 96.5922L155.647 96.6296Z" fill="currentColor" />
    <path d="M122.044 106.929C119.074 107.475 116.607 109.516 115.536 112.314C114.382 115.327 115.055 118.75 117.242 121.136C119.256 123.333 122.285 124.378 125.237 123.87L125.465 123.831C128.566 123.297 131.128 121.133 132.152 118.184C133.174 115.237 132.471 111.944 130.361 109.634C128.318 107.399 125.226 106.344 122.235 106.894L122.044 106.929Z" fill="currentColor" />
    <path d="M194.797 100.167C198.062 97.842 199.814 93.9567 199.382 89.9956C198.952 86.0553 196.374 82.6206 192.711 81.0291C188.98 79.4084 184.553 79.9029 181.278 82.3027C178.065 84.6565 176.315 88.567 176.768 92.4999C177.226 96.4687 179.855 99.9064 183.569 101.463C187.218 102.991 191.455 102.547 194.672 100.256L194.797 100.167Z" fill="currentColor" />
    <path d="M143.547 76.9231C140.02 75.422 135.93 75.8759 132.838 78.1316L132.635 78.2799C129.576 80.5122 127.956 84.1953 128.388 87.9351C128.818 91.6576 131.216 94.8714 134.683 96.37L134.941 96.4818C138.5 98.0201 142.633 97.5368 145.743 95.2348C148.799 92.9731 150.429 89.2632 150 85.5083C149.567 81.7133 147.09 78.4303 143.547 76.9231Z" fill="currentColor" />
    <path d="M87.5002 111.6C87.9339 115.132 90.2263 118.171 93.5227 119.583L93.783 119.695C97.0704 121.104 100.883 120.695 103.805 118.643C106.858 116.498 108.496 112.849 108.033 109.17C107.586 105.623 105.275 102.577 101.96 101.167L101.802 101.1C98.4295 99.6652 94.4972 100.149 91.5511 102.318C88.6351 104.464 87.0615 108.027 87.5002 111.6Z" fill="currentColor" />
    <path d="M83.5926 162.917C86.3842 160.917 87.914 157.568 87.5525 154.174C87.1907 150.777 85.0202 147.831 81.864 146.455L81.7038 146.385C78.5431 145.006 74.8491 145.41 72.046 147.409C69.1713 149.458 67.6328 152.932 68.0964 156.41C68.5429 159.761 70.749 162.627 73.893 163.94L74.0644 164.011C77.2022 165.322 80.8332 164.893 83.5926 162.917Z" fill="currentColor" />
    <path d="M84.6249 209.303C87.64 210.576 91.1868 210.172 93.8311 208.254C96.47 206.339 97.9097 203.147 97.5482 199.927C97.1864 196.704 95.0722 193.902 92.0695 192.61C89.026 191.3 85.4291 191.712 82.7638 193.67C80.1533 195.588 78.7296 198.764 79.0888 201.964C79.4529 205.207 81.5946 208.023 84.6249 209.303Z" fill="currentColor" />
    <path d="M120.479 242.991C124.214 244.575 128.555 244.028 131.796 241.602C134.93 239.256 136.624 235.425 136.2 231.556C135.762 227.558 133.167 224.11 129.424 222.552L129.297 222.499C125.65 220.981 121.469 221.45 118.257 223.737L118.136 223.823C114.865 226.152 113.121 230.052 113.579 234.018C114.032 237.948 116.578 241.336 120.249 242.893L120.479 242.991Z" fill="currentColor" />
    <path d="M169.697 247.125C173.167 248.558 177.17 248.076 180.214 245.89C183.324 243.656 185.012 239.913 184.58 236.131C184.151 232.371 181.722 229.125 178.215 227.625L178.093 227.572C174.607 226.081 170.589 226.499 167.492 228.675L167.352 228.773C164.21 230.98 162.527 234.705 162.957 238.497C163.387 242.282 165.854 245.538 169.403 247.004L169.697 247.125Z" fill="currentColor" />
    <path d="M225.479 212.369C225.048 208.853 222.776 205.823 219.503 204.397L219.367 204.338C215.988 202.865 212.027 203.325 209.052 205.491C206.161 207.595 204.564 211.089 204.927 214.625C205.298 218.239 207.612 221.373 210.976 222.818L211.111 222.876C214.487 224.326 218.433 223.852 221.394 221.687C224.331 219.54 225.92 215.959 225.479 212.369Z" fill="currentColor" />
    <path d="M231.295 177.666C234.479 179.002 238.184 178.59 240.964 176.553L241.076 176.47C243.866 174.426 245.325 171.049 244.892 167.639C244.464 164.262 242.196 161.348 239.027 160.033C235.84 158.71 232.134 159.13 229.359 161.171L229.265 161.241C226.537 163.248 225.082 166.533 225.439 169.881C225.806 173.323 228.076 176.317 231.295 177.666Z" fill="currentColor" />
    <path d="M230.247 130.328C232.855 128.409 234.27 125.237 233.911 122.039C233.547 118.794 231.403 115.976 228.372 114.696C225.359 113.424 221.817 113.825 219.175 115.742C216.531 117.659 215.094 120.857 215.461 124.082C215.827 127.301 217.942 130.097 220.941 131.388C223.986 132.698 227.581 132.289 230.247 130.328Z" fill="currentColor" />
    <path d="M261.782 139.996C260.822 135.845 257.732 132.499 253.645 131.182L253.427 131.112C249.223 129.759 244.575 130.758 241.287 133.686C237.984 136.627 236.516 141.142 237.508 145.431C238.469 149.582 241.558 152.928 245.646 154.244L245.864 154.314C250.068 155.668 254.716 154.668 258.004 151.741C261.307 148.799 262.775 144.284 261.782 139.996Z" fill="currentColor" />
    <path d="M208.432 95.2038C209.312 99.1928 212.263 102.42 216.184 103.68L216.432 103.76C220.376 105.028 224.721 104.12 227.827 101.398C230.982 98.6333 232.4 94.3796 231.505 90.3016C230.626 86.2936 227.664 83.0501 223.726 81.7842L223.56 81.7307C219.585 80.4532 215.192 81.3917 212.075 84.1477C208.951 86.9087 207.539 91.1525 208.432 95.2038Z" fill="currentColor" />
    <path d="M159.727 61.4711C156.763 64.0987 155.447 68.1106 156.295 71.9603C157.131 75.7555 159.937 78.8262 163.666 80.0272L163.871 80.093C167.623 81.3017 171.75 80.4339 174.691 77.827C177.655 75.1994 178.972 71.1875 178.123 67.3378C177.287 63.5427 174.481 60.472 170.752 59.271L170.548 59.2051C166.795 57.9964 162.668 58.8643 159.727 61.4711Z" fill="currentColor" />
    <path d="M105.028 91.6749C108.595 92.8218 112.509 92.008 115.311 89.537L115.42 89.4404C118.191 86.9965 119.423 83.2663 118.646 79.6725C117.877 76.1154 115.257 73.232 111.766 72.1023L111.544 72.0304C108.016 70.8884 104.104 71.7046 101.311 74.1256C98.5079 76.5547 97.2004 80.3206 97.9476 83.935C98.6955 87.5525 101.349 90.4924 104.894 91.6321L105.028 91.6749Z" fill="currentColor" />
    <path d="M66.5096 133.19C69.8888 134.277 73.6477 133.512 76.2879 131.156L76.3799 131.074C78.966 128.767 80.1117 125.267 79.3844 121.895C78.655 118.513 76.1532 115.778 72.8279 114.726L72.6291 114.663C69.337 113.621 65.7075 114.379 63.0978 116.624C60.4165 118.93 59.1798 122.519 59.9127 125.961C60.6349 129.352 63.1817 132.119 66.5096 133.19Z" fill="currentColor" />
    <path d="M51.1569 183.946C52.1047 188.13 55.2099 191.508 59.3261 192.834L59.5837 192.917C63.7392 194.255 68.3235 193.303 71.6066 190.447C74.9352 187.55 76.4545 183.08 75.5411 178.785C74.6327 174.514 71.4826 171.054 67.288 169.719L67.0592 169.646C62.8782 168.315 58.2683 169.302 54.9903 172.198C51.6687 175.131 50.1824 179.645 51.1569 183.946Z" fill="currentColor" />
    <path d="M104.538 228.857C103.677 224.844 100.719 221.592 96.7789 220.329L96.6125 220.275C92.5978 218.988 88.1519 219.963 85.0243 222.769C81.9679 225.512 80.5705 229.694 81.4225 233.691C82.2934 237.777 85.3348 241.072 89.3649 242.297L89.5027 242.339C93.4481 243.538 97.7881 242.565 100.868 239.844C103.97 237.104 105.401 232.884 104.538 228.857Z" fill="currentColor" />
    <path d="M153.334 262.423C156.202 259.859 157.535 255.954 156.779 252.202C155.99 248.289 153.099 245.119 149.248 243.948L149.088 243.899C145.43 242.786 141.408 243.646 138.504 246.116C135.452 248.713 134.036 252.797 134.89 256.692C135.718 260.467 138.51 263.522 142.22 264.712L142.39 264.767C146.18 265.983 150.377 265.067 153.334 262.423Z" fill="currentColor" />
    <path d="M207.942 232.318C204.393 231.176 200.464 232.015 197.677 234.474C194.872 236.948 193.606 240.765 194.426 244.396C195.238 247.992 197.937 250.88 201.494 251.957L201.752 252.036C205.232 253.09 209.026 252.265 211.749 249.874C214.533 247.429 215.798 243.687 215.047 240.077C214.292 236.451 211.631 233.505 208.077 232.361L207.942 232.318Z" fill="currentColor" />
    <path d="M240.312 209.28C243.633 210.355 247.31 209.581 249.927 207.288C252.555 204.987 253.757 201.436 253.025 198.038C252.301 194.684 249.83 191.964 246.539 190.899L246.321 190.829C243.009 189.757 239.338 190.526 236.719 192.802C234.062 195.112 232.847 198.701 233.605 202.123C234.342 205.451 236.803 208.145 240.072 209.203L240.312 209.28Z" fill="currentColor" />
    <path d="M247.635 219.309C242.866 218.57 238.039 220.407 234.975 224.103C231.877 227.841 231.033 232.966 232.797 237.476C234.54 241.933 238.546 245.133 243.313 245.876L243.59 245.919C248.357 246.661 253.199 244.82 256.276 241.137C259.392 237.407 260.262 232.259 258.496 227.744C256.756 223.295 252.756 220.102 247.998 219.365L247.635 219.309Z" fill="currentColor" />
    <path d="M281.076 175.574C283.995 172.03 284.781 167.162 283.083 162.909C281.414 158.729 277.628 155.743 273.142 155.069L272.743 155.009C268.31 154.343 263.847 156.022 260.977 159.435C257.981 162.999 257.187 167.904 258.903 172.219C260.587 176.455 264.431 179.483 268.978 180.146L269.167 180.174C273.662 180.83 278.203 179.061 281.076 175.574Z" fill="currentColor" />
    <path d="M243.604 94.1394C240.836 97.4879 240.113 102.059 241.715 106.085C243.292 110.047 246.879 112.876 251.128 113.512L251.456 113.561C255.624 114.185 259.828 112.6 262.533 109.397C265.365 106.044 266.126 101.413 264.501 97.3484C262.946 93.4626 259.451 90.6675 255.289 89.9824L254.913 89.9205C250.653 89.2194 246.339 90.8295 243.604 94.1394Z" fill="currentColor" />
    <path d="M195.091 68.2636C199.085 68.8746 203.119 67.3278 205.67 64.2224C208.248 61.0846 208.932 56.8003 207.441 53.0339C205.978 49.3379 202.651 46.6836 198.695 46.0546L198.465 46.018C194.459 45.3813 190.412 46.9123 187.851 50.0295C185.273 53.1674 184.594 57.439 186.076 61.2088C187.546 64.9465 190.915 67.6248 194.917 68.237L195.091 68.2636Z" fill="currentColor" />
    <path d="M125.547 64.0404C129.29 64.6312 133.086 63.1705 135.469 60.2505C137.836 57.3486 138.47 53.3865 137.096 49.9125C135.743 46.493 132.667 44.036 129.007 43.4514L128.766 43.4129C125.051 42.8194 121.262 44.2577 118.861 47.128C116.44 50.0209 115.759 54.0274 117.136 57.5284C118.482 60.9519 121.561 63.4111 125.223 63.9893L125.547 64.0404Z" fill="currentColor" />
    <path d="M65.4813 104.771C70.1888 105.462 74.9343 103.652 77.9755 100.026C81.1052 96.294 81.9735 91.16 80.2206 86.6296C78.4705 82.1064 74.3954 78.8689 69.5586 78.159L69.3018 78.1213C64.5944 77.4305 59.8488 79.2407 56.8077 82.8669C53.6779 86.5987 52.8097 91.7327 54.5626 96.2631C56.3127 100.786 60.3878 104.024 65.2246 104.734L65.4813 104.771Z" fill="currentColor" />
    <path d="M31.8488 148.429C28.9263 151.972 28.1395 156.839 29.8385 161.094C31.5069 165.272 35.2917 168.257 39.7759 168.93L40.137 168.985C44.5953 169.654 49.1082 167.936 51.9944 164.504C54.9476 160.992 55.781 156.142 54.131 151.873C52.503 147.662 48.7317 144.63 44.2363 143.918L43.894 143.864C39.3598 143.147 34.7544 144.907 31.8488 148.429Z" fill="currentColor" />
    <path d="M69.3607 229.777C72.0918 226.442 72.8222 221.886 71.2411 217.888C69.6804 213.941 66.1226 211.112 61.8956 210.456L61.7414 210.432C57.4543 209.766 53.1027 211.449 50.3686 214.787C47.6759 218.075 46.9194 222.57 48.4316 226.529C49.9703 230.559 53.5873 233.449 57.8879 234.086L58.1148 234.119C62.3647 234.749 66.6533 233.083 69.3607 229.777Z" fill="currentColor" />
    <path d="M117.835 255.856C113.878 255.22 109.876 256.711 107.324 259.774C104.733 262.884 104.035 267.138 105.495 270.901C106.946 274.639 110.303 277.326 114.298 277.942L114.492 277.971C118.478 278.586 122.518 277.029 125.065 273.929C127.63 270.807 128.315 266.526 126.816 262.785C125.36 259.150 122.083 256.540 118.187 255.913L117.835 255.856Z" fill="currentColor" />
    <path d="M187.444 259.945C183.697 259.354 179.896 260.819 177.514 263.744C175.148 266.648 174.517 270.613 175.896 274.087C177.254 277.506 180.335 279.96 183.998 280.538L184.316 280.589C188.063 281.18 191.864 279.715 194.247 276.79C196.613 273.885 197.243 269.92 195.865 266.447C194.507 263.027 191.426 260.574 187.763 259.995L187.444 259.945Z" fill="currentColor" />
    <path d="M156.186 282.045C150.803 282.045 145.827 284.885 143.126 289.498C140.415 294.129 140.414 299.852 143.115 304.489C145.818 309.131 150.822 312 156.232 312H156.576C161.926 312 166.884 309.193 169.609 304.632C172.422 299.923 172.421 294.058 169.597 289.355C166.875 284.823 161.945 282.045 156.621 282.045H156.186Z" fill="currentColor" />
    <path d="M237.787 256.909C232.74 256.909 228.071 259.561 225.522 263.877C222.929 268.269 222.929 273.704 225.522 278.096C228.071 282.412 232.74 285.064 237.787 285.064H238.116C243.164 285.064 247.833 282.412 250.381 278.096C252.975 273.704 252.975 268.269 250.381 263.877C247.833 259.561 243.164 256.909 238.116 256.909H237.787Z" fill="currentColor" />
    <path d="M299.169 197.965C296.783 193.945 292.427 191.478 287.72 191.478H287.367C282.639 191.478 278.267 193.968 275.888 198.016C273.489 202.098 273.488 207.150 275.876 211.238C278.258 215.314 282.658 217.834 287.412 217.834H287.675C292.408 217.834 296.791 215.337 299.181 211.289C301.609 207.175 301.608 202.072 299.169 197.965Z" fill="currentColor" />
    <path d="M287.665 131.584C292.041 131.584 296.093 129.298 298.325 125.570C300.638 121.707 300.638 116.902 298.325 113.040C296.093 109.312 292.041 107.026 287.665 107.026H287.445C283.069 107.026 279.018 109.312 276.785 113.040C274.472 116.902 274.472 121.707 276.785 125.570C279.018 129.298 283.069 131.584 287.445 131.584H287.665Z" fill="currentColor" />
    <path d="M238.077 64.3698C242.147 64.3698 245.928 62.2063 247.987 58.7286C250.086 55.183 250.083 50.758 247.954 47.2301C245.903 43.8319 242.2 41.7513 238.203 41.7513H237.778C233.782 41.7513 230.079 43.8319 228.028 47.2301C225.898 50.7579 225.896 55.183 227.995 58.7286C230.054 62.2063 233.835 64.3698 237.904 64.3698H238.077Z" fill="currentColor" />
    <path d="M156.769 41.9546C162.179 41.9546 167.183 39.0852 169.886 34.4435C172.587 29.8066 172.586 24.0834 169.875 19.4525C167.174 14.8394 162.198 12 156.815 12H156.450C151.089 12 146.129 14.8171 143.420 19.4013C140.669 24.0581 140.668 29.832 143.409 34.4949C146.120 39.1077 151.108 41.9546 156.496 41.9546H156.769Z" fill="currentColor" />
    <path d="M75.1328 67.0915C80.1803 67.0915 84.849 64.4389 87.3979 60.1228C89.9914 55.7315 89.9914 50.2956 87.3979 45.9043C84.849 41.5883 80.1803 38.9357 75.1328 38.9357H74.8522C69.8217 38.9357 65.1661 41.5705 62.6112 45.8636C59.9856 50.2754 59.9856 55.7518 62.6112 60.1635C65.1661 64.4566 69.8217 67.0915 74.8522 67.0915H75.1328Z" fill="currentColor" />
    <path d="M25.5473 132.522C30.2804 132.522 34.6639 130.025 37.0531 125.977C39.4812 121.863 39.4804 116.760 37.0415 112.653C34.655 108.633 30.2995 106.165 25.5925 106.165H25.2799C20.5729 106.165 16.2174 108.633 13.8309 112.653C11.392 116.760 11.3912 121.863 13.8193 125.977C16.2085 130.025 20.592 132.522 25.3252 132.522H25.5473Z" fill="currentColor" />
    <path d="M25.3288 192.338C20.946 192.338 16.8879 194.627 14.6517 198.362C12.3414 202.220 12.3406 207.028 14.640 210.892C16.879 214.655 20.965 216.974 25.3738 216.974H25.5541C30.0014 216.974 34.1169 214.615 36.3422 210.8C38.5695 206.982 38.5687 202.265 36.3308 198.453C34.108 194.667 30.0206 192.338 25.5996 192.338H25.3288Z" fill="currentColor" />
    <path d="M74.8186 259.63C70.7622 259.63 67.0076 261.754 64.9448 265.214C62.8267 268.767 62.8259 273.189 64.9332 276.748C66.9986 280.237 70.7812 282.390 74.8638 282.390H75.0750C79.1575 282.390 82.9401 280.237 85.0056 276.748C87.1129 273.189 87.1120 268.767 84.9940 265.214C82.9312 261.754 79.1766 259.630 75.1201 259.630H74.8186Z" fill="currentColor" />
  </svg>
);

export default function SiteNav({ hidePricing = false }: { hidePricing?: boolean }) {

  const { t } = useTranslation("common");
  const location = useLocation();
  const currentPath =
    location.pathname !== "/" && location.pathname.endsWith("/")
      ? location.pathname.slice(0, -1)
      : location.pathname;

  const isActive = useCallback(
    (href: string) => href === currentPath,
    [currentPath],
  );

  const industries: { href: string; label: string }[] = INDUSTRY_LINKS.map((l) => ({
    href: l.href,
    label: t(`industries.${l.key}`),
  }));
  const topLinks: { href: string; soon?: boolean; label: string }[] = TOP_LINKS
    .filter((l) => !(hidePricing && l.key === "pricing"))
    .map((l) => ({
      href: l.href,
      soon: l.soon,
      label: t(`nav.${l.key}`),
    }));

  const industryActive = INDUSTRY_LINKS.some((i) => isActive(i.href));

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const menuRef = useRef<HTMLDivElement>(null);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [groupOpen, setGroupOpen] = useState(industryActive);
  const lastFocusRef = useRef<HTMLElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  // Close the mobile menu whenever the route changes (tapping a link navigates).
  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  const { ref: bgRef, clipPath, transform } = useMorphingShape<HTMLDivElement>({
    radiusMin: 16,
    radiusMax: 26,
    bulgeRange: 0.18,
    driftX: 1.5,
    driftScale: 0.003,
    driftY: 4,
    driftPeriodMs: 5200,
  });

  const headerRef = useRef<HTMLElement>(null);
  const [navTheme, setNavTheme] = useState<"light" | "dark" | "cross">("dark");
  const navThemeRef = useRef<"light" | "dark" | "cross">("dark");

  // Measure what sits behind the bar: "light" fully over a light region (bar
  // turns dark/black), "dark" over a dark region (bar turns cream), "cross"
  // while a section edge is inside the bar (mix-blend so both halves read).
  const computeNavTheme = useCallback((): "light" | "dark" | "cross" => {
    const header = headerRef.current;
    if (!header) return navThemeRef.current;

    const { top, bottom } = header.getBoundingClientRect();
    let crossing = false;
    let overLight = false;

    const lights = document.querySelectorAll(
      ".theme-light:not([data-nav-dark]), [data-nav-light]:not([data-nav-dark])",
    );
    for (const el of lights) {
      const r = (el as HTMLElement).getBoundingClientRect();
      if (r.bottom <= top || r.top >= bottom) continue;

      const edgeInBar =
        (r.top > top && r.top < bottom) || (r.bottom > top && r.bottom < bottom);
      if (edgeInBar) crossing = true;
      else if (r.top <= top && r.bottom >= bottom) overLight = true;
    }
    return crossing ? "cross" : overLight ? "light" : "dark";
  }, []);

  const applyNavTheme = useCallback(() => {
    const next = computeNavTheme();
    if (next !== navThemeRef.current) {
      navThemeRef.current = next;
      setNavTheme(next);
    }
  }, [computeNavTheme]);

  useAnimationFrame(applyNavTheme);

  // Resolve the theme synchronously before the first paint — and again on every
  // route change, since each lazy page re-suspends — so the bar lands on the
  // right color immediately instead of flashing the default cream over a light
  // hero (the loading fallback carries data-nav-light for exactly this).
  useLayoutEffect(() => {
    applyNavTheme();
  }, [applyNavTheme, currentPath]);

  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
      closeBtnRef.current?.focus();
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  useEffect(() => {
    if (!drawerOpen && lastFocusRef.current) {
      lastFocusRef.current.focus();
      lastFocusRef.current = null;
    }
  }, [drawerOpen]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setDrawerOpen(false);
        setDropdownOpen(false);
      }
    };
    const onDocClick = (e: MouseEvent) => {
      const t = e.target as Node;
      const trigger = dropdownRef.current;
      const menu = menuRef.current;
      if (trigger && !trigger.contains(t) && menu && !menu.contains(t)) {
        setDropdownOpen(false);
      }
    };
    const onResize = () => {
      if (window.innerWidth > BREAKPOINT) setDrawerOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("click", onDocClick);
    window.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("click", onDocClick);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const toggleDropdown = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      setDropdownOpen((v) => !v);
    },
    [],
  );

  const toggleHamburger = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      setDrawerOpen((v) => {
        if (v) return false;
        lastFocusRef.current = document.activeElement as HTMLElement | null;
        return true;
      });
    },
    [],
  );

  // When the menu is open, force ONE solid, opaque theme (cream + dark text,
  // no mix-blend) so the panel is never see-through.
  const barTheme = drawerOpen ? "dark" : navTheme;

  return (
    <>
      <div
        aria-hidden="true"
        onClick={closeDrawer}
        className={cn(
          "fixed inset-0 z-90 bg-black/40 backdrop-blur-[2px] transition-opacity duration-220 md:hidden!",
          drawerOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
      />
      <header
      ref={headerRef}
      role="banner"
      className={cn(

        "global-bar",
        "fixed inset-x-0 top-0 z-100 m-0 w-full",
        "grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-x-6 p-4! px-8!",
        "font-normal leading-[1.2] tracking-[.01em] text-base",

        barTheme === "light" && "text-white",
        barTheme === "dark" && "text-[#0c0c0c]",
        barTheme === "cross" && "text-[#0c0c0c] mix-blend-difference",

        "mt-6!",
        "w-[calc(100%-3rem)]",
        "left-6",

        "max-lg:gap-x-4",
        "max-md:grid-cols-[1fr_auto] max-md:gap-x-3 max-md:py-3 max-md:px-4!",
      )}
    >

      <motion.div
        ref={bgRef}
        aria-hidden="true"
        // While the mobile menu is open the header grows; freeze the morphing
        // shape to a plain rounded rect so the bg covers the whole expanded
        // header as ONE shape.
        style={{
          clipPath: drawerOpen ? "inset(0 round 24px)" : clipPath,
          transform: drawerOpen ? "none" : transform,
        }}
        className={cn(
          "absolute inset-0 -z-10 pointer-events-none",
          barTheme === "light" && "bg-[#0c0c0c]",
          barTheme === "dark" && "bg-[#faf9f5]",
          barTheme === "cross" && "bg-[#faf9f5]",
        )}
      />
      <div className="justify-self-start max-md:justify-self-auto">
        <Link to="/" className="text-2xl text-inherit no-underline relative top-[-3px]">
          <FlusoText />
        </Link>
      </div>

      <nav
        aria-label={t("nav.primaryLabel")}
        className="flex items-center justify-self-center justify-center gap-6 max-lg:gap-4 max-md:hidden!"
      >
        <div
          ref={dropdownRef}
          className="relative inline-flex items-center"
        >
          <button
            type="button"
            aria-haspopup="true"
            aria-expanded={dropdownOpen}
            aria-controls="nav-professionals-menu"
            onClick={toggleDropdown}
            className={cn(
              "inline-flex items-center gap-1.5 cursor-pointer",
              // native <button> doesn't inherit font-size/family — pin them to
              // the header's so "Professionals" matches the sibling links and
              // sits on the same baseline (was rendering at the UA default ~13px)
              "bg-transparent border-0 font-sans text-inherit text-base font-normal leading-[1.2]",
              "",
              "transition-opacity duration-180 ease-[ease]",
              "[-webkit-tap-highlight-color:transparent]",
              industryActive && "opacity-100",
            )}
          >
            {t("nav.professionals")}{" "}
            <IconChevron
              size={10}
              className={cn(
                "transition-transform duration-200",
                dropdownOpen && "rotate-180",
              )}
            />
          </button>
        </div>

        {topLinks.map((l) =>
          l.soon ? (
            <span
              key={l.label}
              aria-disabled="true"
              title={t("nav.comingSoon")}
              className="inline-block cursor-default opacity-35 [-webkit-tap-highlight-color:transparent]"
            >
              {l.label}
            </span>
          ) : (
            <Link
              key={l.href}
              to={l.href}
              className={cn(
                "text-inherit no-underline",
                "",
                "transition-opacity duration-180 ease-[ease]",
                isActive(l.href) && "opacity-100",
              )}
            >
              {l.label}
            </Link>
          ),
        )}
      </nav>

      <div
        ref={menuRef}
        role="menu"
        id="nav-professionals-menu"
        className={cn(
          "absolute inset-x-0 top-[calc(100%+10px)] z-100",
          "rounded-[32px] p-[clamp(14px,1.6vw,24px)]",
          navTheme === "light"
            ? "bg-ink text-bone shadow-[0_28px_72px_rgba(0,0,0,0.5)]"
            : "bg-[#faf9f5] text-ink shadow-[0_28px_72px_rgba(0,0,0,0.35)]",

          "before:content-[''] before:absolute before:-top-3 before:inset-x-0 before:h-3",
          "transition-[opacity,transform] duration-200 ease-[ease]",
          "max-md:hidden",
          dropdownOpen
            ? "visible translate-y-0 opacity-100 pointer-events-auto"
            : "invisible -translate-y-1.5 opacity-0 pointer-events-none",
        )}
      >
        <div className="grid grid-cols-3 gap-1.5 max-lg:grid-cols-2">
          {industries.map((i) => (
            <Link
              key={i.href}
              to={i.href}
              role="menuitem"
              onClick={() => setDropdownOpen(false)}
              className={cn(
                "rounded-2xl px-5 py-3.5 no-underline",
                "text-[15px] transition-[background,color] duration-150",
                navTheme === "light"
                  ? "text-bone/75 hover:bg-white/8 hover:text-bone"
                  : "text-ink/70 hover:bg-ink/6 hover:text-ink",
                isActive(i.href) &&
                  (navTheme === "light"
                    ? "bg-white/8 font-medium text-bone"
                    : "bg-ink/6 font-medium text-ink"),
              )}
            >
              {i.label}
            </Link>
          ))}
        </div>
      </div>

      <div
        className={cn(
          "justify-self-end text-right",
          "max-md:flex! max-md:items-center max-md:justify-end max-md:ml-auto",
          "max-md:justify-self-auto max-md:opacity-100",
        )}
      >

        <div className="inline-flex items-center gap-5 max-md:hidden!">
          <a
            href="https://form.typeform.com/to/vZnBDhzs"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "whitespace-nowrap inline-flex items-center gap-1.5",
              "text-base no-underline text-inherit",
              "transition-opacity duration-[180ms] ease-[ease] hover:opacity-70",
            )}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
              className="shrink-0"
            >
              <rect
                x="2"
                y="3.5"
                width="12"
                height="9"
                rx="1.5"
                stroke="currentColor"
                strokeWidth="1.6"
              />
              <path
                d="M2.5 5.5L8 9.5l5.5-4"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {t("nav.contact")}
          </a>
          <Link
            to="/download"
            className={cn(
              "whitespace-nowrap inline-flex items-center gap-1.5",
              "rounded-[1rem] px-4 py-1 text-base no-underline",

              navTheme === "light" && "bg-[#faf9f5] text-[#0c0c0c]",
              navTheme === "dark" && "bg-[#0c0c0c] text-[#faf9f5]",
              navTheme === "cross" && "bg-[#0c0c0c] text-[#faf9f5]",
              "transition-[transform,opacity] duration-[180ms] ease-[ease] hover:opacity-90",
            )}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
              className="shrink-0"
            >
              <path
                d="M8 2.5v8.5M4.5 7.5L8 11l3.5-3.5M3 14h10"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {t("nav.getStarted")}
          </Link>
        </div>
        <button
          type="button"
          aria-label={drawerOpen ? t("nav.closeMenu") : t("nav.openMenu")}
          aria-expanded={drawerOpen}
          aria-controls="site-nav-drawer"
          onClick={toggleHamburger}
          className={cn(
            "hidden m-0 size-9 cursor-pointer items-center justify-center rounded-full p-0 leading-none",
            "border border-current/20 bg-transparent",
            barTheme === "light" && "text-[#faf9f5]",
            barTheme !== "light" && "text-[#0c0c0c]",
            "hover:opacity-80",
            "[-webkit-tap-highlight-color:transparent]",
            "max-md:inline-flex",
          )}
        >
          <IconMenu className={drawerOpen ? "hidden" : "block"} />
          <IconClose className={drawerOpen ? "block" : "hidden"} />
        </button>
      </div>

      {/* Mobile menu — PART OF THE HEADER: a full-width row that expands the
          header itself (its bg grows to cover this as one shape). The hamburger
          toggles to ✕; tapping a link or the backdrop closes it. */}
      <div
        id="site-nav-drawer"
        ref={menuRef}
        aria-hidden={!drawerOpen}
        aria-label={t("nav.navigationLabel")}
        onClick={(e) => {
          if ((e.target as HTMLElement).closest("a")) closeDrawer();
        }}
        className={cn(
          "col-span-full hidden min-w-0 max-md:grid",
          "transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.22,0.61,0.36,1)]",
          drawerOpen ? "[grid-template-rows:1fr]" : "[grid-template-rows:0fr]",
        )}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="flex flex-col gap-0.5 pt-5">
            <div className="flex flex-col">
              <button
                type="button"
                aria-expanded={groupOpen}
                onClick={() => setGroupOpen((v) => !v)}
                className={cn(
                  "flex w-full items-center justify-between text-left",
                  "pl-1 pr-3 py-3 rounded-lg cursor-pointer",
                  "bg-transparent border-0 font-sans text-inherit",
                  "text-[17px] font-medium tracking-[-.005em] no-underline",
                  "opacity-90 hover:opacity-100 hover:bg-current/8",
                  "transition-[background,opacity] duration-150",
                  "[-webkit-tap-highlight-color:transparent]",
                  industryActive && "opacity-100 bg-current/10",
                )}
              >
                <span>{t("nav.professionals")}</span>
                <IconChevron
                  className={cn(
                    "transition-transform duration-200 opacity-70",
                    groupOpen && "rotate-180",
                  )}
                />
              </button>
              <div
                className={cn(
                  "flex-col gap-px pt-1 pb-1.5",
                  groupOpen ? "flex" : "hidden",
                )}
              >
                {industries.map((i) => (
                  <Link
                    key={i.href}
                    to={i.href}
                    className={cn(
                      "block px-3.5 py-2.5 rounded-md no-underline",
                      "text-[15px] text-current/70",
                      "transition-[background,opacity,color] duration-150",
                      "hover:bg-current/6 hover:text-current",
                      "[-webkit-tap-highlight-color:transparent]",
                      isActive(i.href) && "text-current font-medium bg-current/10",
                    )}
                  >
                    {i.label}
                  </Link>
                ))}
              </div>
            </div>

            {topLinks.map((l) =>
              l.soon ? (
                <span
                  key={l.label}
                  aria-disabled="true"
                  className={cn(
                    "flex w-full items-center justify-between",
                    "pl-1 pr-3 py-3 text-[17px] font-medium",
                    "opacity-45 cursor-default",
                    "[-webkit-tap-highlight-color:transparent]",
                  )}
                >
                  {l.label}
                </span>
              ) : (
                <Link
                  key={l.href}
                  to={l.href}
                  className={cn(
                    "flex w-full items-center justify-between text-left",
                    "pl-1 pr-3 py-3 rounded-lg no-underline text-inherit",
                    "text-[17px] font-medium tracking-[-.005em]",
                    "opacity-90 hover:opacity-100 hover:bg-current/8",
                    "transition-[background,opacity] duration-150",
                    "[-webkit-tap-highlight-color:transparent]",
                    isActive(l.href) && "opacity-100 bg-current/10",
                  )}
                >
                  {l.label}
                </Link>
              ),
            )}

            <div className="mt-2 flex flex-col gap-2.5 border-t border-current/15 pt-3">
              <Link
                to="/download"
                className={cn(
                  "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 no-underline",
                  "text-[16px] font-medium",
                  barTheme === "light"
                    ? "bg-[#faf9f5] text-[#0c0c0c]"
                    : "bg-[#0c0c0c] text-[#faf9f5]",
                  "[-webkit-tap-highlight-color:transparent]",
                )}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="shrink-0">
                  <path d="M8 2.5v8.5M4.5 7.5L8 11l3.5-3.5M3 14h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {t("nav.getStarted")}
              </Link>
              <a
                href="https://form.typeform.com/to/vZnBDhzs"
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 no-underline",
                  "border border-current/25 text-inherit text-[16px] font-medium",
                  "[-webkit-tap-highlight-color:transparent]",
                )}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="shrink-0">
                  <rect x="2" y="3.5" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
                  <path d="M2.5 5.5L8 9.5l5.5-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {t("nav.contact")}
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
    </>
  );
}
