/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { Button, Spinner } from '@wordpress/components';
import { cleanForSlug } from '@wordpress/url';
import {
	Product,
	PRODUCTS_STORE_NAME,
	WCDataSelector,
} from '@woocommerce/data';
import { useFormContext } from '@woocommerce/components';
import { useSelect } from '@wordpress/data';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { EditProductLinkModal } from '../shared/edit-product-link-modal';
import { getPermalinkParts } from '../utils/get-permalink-parts';
import { useProductAutoSave } from '../hooks/use-product-auto-save';

export const ProductLinkField = () => {
	const { errors, touched, values } = useFormContext< Product >();
	const [ showProductLinkEditModal, setShowProductLinkEditModal ] =
		useState( false );
	const hasNameError = Boolean( touched.name ) && Boolean( errors.name );
	const { isAutoSaving } = useProductAutoSave( [ 'name' ] );

	const { permalinkPrefix, permalinkSuffix, isResolving } = useSelect(
		( select: WCDataSelector ) => {
			if ( ! values.id ) {
				return {
					permalinkPrefix: null,
					permalinkSuffix: null,
				};
			}

			const { getProduct, isResolving: isProductResolving } =
				select( PRODUCTS_STORE_NAME );
			const product = getProduct( values.id );
			const parts = getPermalinkParts( product.permalink_template );
			return {
				permalinkPrefix: parts?.prefix,
				permalinkSuffix: parts?.suffix,
				isResolving: isProductResolving( 'getProduct', [ values.id ] ),
			};
		}
	);

	if ( ! values.name && ! values.slug ) {
		return null;
	}

	if ( isAutoSaving || isResolving ) {
		return <Spinner />;
	}

	if ( hasNameError || ! permalinkPrefix ) {
		return null;
	}

	return (
		<>
			<span className="woocommerce-product-form__secondary-text product-details-section__product-link">
				{ __( 'Product link', 'woocommerce' ) }
				:&nbsp;
				<a href={ values.permalink } target="_blank" rel="noreferrer">
					{ permalinkPrefix }
					{ values.slug || cleanForSlug( values.name ) }
					{ permalinkSuffix }
				</a>
				<Button
					variant="link"
					onClick={ () => setShowProductLinkEditModal( true ) }
				>
					{ __( 'Edit', 'woocommerce' ) }
				</Button>
			</span>
			{ showProductLinkEditModal && (
				<EditProductLinkModal
					permalinkPrefix={ permalinkPrefix || '' }
					permalinkSuffix={ permalinkSuffix || '' }
					product={ values }
					onCancel={ () => setShowProductLinkEditModal( false ) }
					onSaved={ () => setShowProductLinkEditModal( false ) }
				/>
			) }
		</>
	);
};