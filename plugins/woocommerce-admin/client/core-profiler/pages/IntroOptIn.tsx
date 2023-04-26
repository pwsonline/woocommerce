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
import { IntroOptInEvent } from '../index';
import { Heading } from '../components/heading/heading';
import Navigation from '../components/navigation/navigation';
import { WelcomeImage } from '../assets/images/welcome-img';

export const IntroOptIn = ( {
	sendEvent,
	navigationProgress,
}: {
	sendEvent: ( event: IntroOptInEvent ) => void;
	navigationProgress: number;
} ) => {
	const [ iOptInDataSharing, setIsOptInDataSharing ] =
		useState< boolean >( true );

	return (
		<div className="woocommerce-profiler-intro-opt-in">
			<Navigation
				percentage={ navigationProgress }
				onSkip={ () =>
					sendEvent( {
						type: 'INTRO_SKIPPED',
						payload: { optInDataSharing: false },
					} )
				}
			/>
			<div className="woocommerce-profiler-page__content woocommerce-profiler-intro-opt-in__content">
				<WelcomeImage />
				<Heading
					title={ __( 'Welcome to Woo!', 'woocommerce' ) }
					subTitle={ interpolateComponents( {
						mixedString: __(
							'We’ll ask you a few questions to tailor your experience with Woo and{{br/}} help you set up your online store in a breeze.',
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
