import { OverlayProvider } from '@gluestack-ui/overlay'
import { ToastProvider } from '@gluestack-ui/toast'
import { colorScheme as colorSchemeNW } from 'nativewind'
import React from 'react'
import { ColorSchemeName, View, ViewProps } from 'react-native'

import { config } from './config'

type ModeType = 'light' | 'dark' | 'system'

function getColorSchemeName(colorScheme: ColorSchemeName, mode: ModeType): 'light' | 'dark' {
	if (mode === 'system') {
		return colorScheme ?? 'light'
	}

	return mode
}

export function GluestackUIProvider({
	mode = 'system',
	colorScheme,
	...props
}: {
	mode?: 'light' | 'dark' | 'system'
	colorScheme?: ColorSchemeName
	children?: React.ReactNode
	style?: ViewProps['style']
}) {
	const colorSchemeName = getColorSchemeName(colorScheme, mode)

	colorSchemeNW.set(mode)

	return (
		<View
			style={[
				config[colorSchemeName],
				// eslint-disable-next-line react-native/no-inline-styles
				{ flex: 1, height: '100%', width: '100%' },
				props.style,
			]}
		>
			<OverlayProvider>
				<ToastProvider>{props.children}</ToastProvider>
			</OverlayProvider>
		</View>
	)
}
