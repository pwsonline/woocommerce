/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { Button, CheckboxControl } from '@wordpress/components';
import { useState } from '@wordpress/element';
import interpolateComponents from '@automattic/interpolate-components';
import { Link } from '@woocommerce/components';

/**
 * Internal dependencies
 */
import { IntroOptInEvent, CoreProfilerStateMachineContext } from '../index';
import { Heading } from '../components/heading/heading';
import { Navigation } from '../components/navigation/navigation';

export const IntroOptIn = ( {
	sendEvent,
	navigationProgress,
	context,
}: {
	sendEvent: ( event: IntroOptInEvent ) => void;
	navigationProgress: number;
	context: CoreProfilerStateMachineContext;
} ) => {
	const [ iOptInDataSharing, setIsOptInDataSharing ] = useState< boolean >(
		context.optInDataSharing
	);

	return (
		<div className="woocommerce-profiler-intro-opt-in">
			<Navigation
				percentage={ navigationProgress }
				skipText={ __( 'Skip guided setup', 'woocommerce' ) }
				onSkip={ () =>
					sendEvent( {
						type: 'INTRO_SKIPPED',
						payload: { optInDataSharing: false },
					} )
				}
			/>
			<div className="woocommerce-profiler-page__content woocommerce-profiler-intro-opt-in__content">
				<div className="woocommerce-profiler-welcome-image" />
				<Heading
					title={ __( 'Welcome to Woo!', 'woocommerce' ) }
					subTitle={ interpolateComponents( {
						mixedString: __(
							"It's great to have you here with us! We'll be guiding you through the setup process – first, answer a few questions to tailor your experience.",
							'woocommerce'
						),
						components: {
							br: <br />,
						},
					} ) }
				/>
				<Button
					className="woocommerce-profiler-setup-store__button"
					variant="primary"
					onClick={ () =>
						sendEvent( {
							type: 'INTRO_COMPLETED',
							payload: { optInDataSharing: iOptInDataSharing },
						} )
					}
				>
					{ __( 'Set up my store', 'woocommerce' ) }
				</Button>

				<div className="woocommerce-profiler-intro-opt-in__footer">
					<CheckboxControl
						className="woocommerce-profiler-intro-opt-in__checkbox"
						label={ interpolateComponents( {
							mixedString: __(
								'I agree to share my data to tailor my store setup experience and get more relevant content. WooCommerce never rent or sell your data and you can opt out at any time in WooCommerce settings. {{link}}Learn more about usage tracking{{/link}}.',
								'woocommerce'
							),
							components: {
								link: (
									<Link
										href="https://woocommerce.com/usage-tracking?utm_medium=product"
										target="_blank"
										type="external"
									/>
								),
							},
						} ) }
						checked={ iOptInDataSharing }
						onChange={ setIsOptInDataSharing }
					/>
				</div>
			</div>
		</div>
	);
};
