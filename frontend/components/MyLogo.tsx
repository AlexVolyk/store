type MyLogo = {
    width: number,
    height: number
}

export const MyLogo = ({ width, height }: MyLogo) => {
    return (
        <svg width={width} height={height} viewBox="0 0 14 14" fill="none">
            <rect x="1" y="1" width="5" height="5" rx="1" fill="#fff" />
            <rect x="8" y="1" width="5" height="5" rx="1" fill="#fff" />
            <rect x="1" y="8" width="5" height="5" rx="1" fill="#fff" />
            <rect x="8" y="8" width="5" height="5" rx="1" fill="#fff" />
        </svg>
    )
}