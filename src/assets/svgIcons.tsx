import type { SVGProps } from 'react';

export const CloseIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    {...props}
  >
    <path
      fill="currentColor"
      d="M6 4.75a.75.75 0 0 0-.743.648L5.25 5.5v9a.75.75 0 0 0 1.493.102l.007-.102v-9A.75.75 0 0 0 6 4.75m8.28.22a.75.75 0 0 0-.976-.073l-.084.073l-4.5 4.5a.75.75 0 0 0-.073.976l.073.084l4.5 4.5a.75.75 0 0 0 1.133-.976l-.073-.084L10.31 10l3.97-3.97a.75.75 0 0 0 0-1.06"
    ></path>
  </svg>
);

export function LeftIcon(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={32} height={32} viewBox="0 0 16 16" {...props}><path fill="currentColor" d="M12.296 11.736a.75.75 0 1 1-1.092 1.028l-4-4.25a.75.75 0 0 1 0-1.027l4-4.25a.75.75 0 1 1 1.092 1.028L8.78 8zM4.75 3a.75.75 0 0 0-.75.75v8.5a.75.75 0 0 0 1.5 0v-8.5A.75.75 0 0 0 4.75 3"></path></svg>);
}
export function RightIcon(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M3.704 11.736a.75.75 0 1 0 1.092 1.028l4-4.25a.75.75 0 0 0 0-1.027l-4-4.25a.75.75 0 1 0-1.092 1.028L7.22 8zM11.25 3a.75.75 0 0 1 .75.75v8.5a.75.75 0 0 1-1.5 0v-8.5a.75.75 0 0 1 .75-.75"></path></svg>);
}