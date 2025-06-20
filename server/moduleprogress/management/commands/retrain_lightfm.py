import os, joblib, pickle, pandas as pd
from lightfm import LightFM
from lightfm.data import Dataset
from moduleprogress.models import ModuleProgress
from modules.models import Module
from django.conf import settings
from django.core.management.base import BaseCommand

class Command(BaseCommand):
    help = "Retrain LightFM model from ModuleProgress"

    def handle(self, *args, **options):
        # Load progress into DataFrame
        qs = ModuleProgress.objects.select_related('module').values(
            'user_id', 'module_id',
            'ndays_act','nchapters','certified','grade'
        )
        df = pd.DataFrame.from_records(qs)
        print("Cols before rename:", df.columns.tolist())

        # Build user features
        user_stats = df.groupby('user_id').agg({
            'ndays_act':'mean',
            'nchapters':'mean'
        }).reset_index().rename(columns={'ndays_act':'mean_days','nchapters':'mean_chaps'})

        user_feats = [
            (row.user_id, [
                f"mean_days:{int(row.mean_days)}",
                f"mean_chaps:{int(row.mean_chaps)}"
            ])
            for _, row in user_stats.iterrows()
        ]

        user_feature_strings = set()
        for row in user_feats:
            user_feature_strings.update(row[1])

        # Setup LightFM dataset
        dataset = Dataset()
        dataset.fit(
            users=df['user_id'].unique(),
            items=df['module_id'].unique(),
            user_features=user_feature_strings
        )

        user_features_matrix = dataset.build_user_features(user_feats)

        # Build interactions with weights
        max_days    = df['ndays_act'].max()
        max_chaps   = df['nchapters'].max()

        df['weight'] = (
            df['certified']
            * (1 + df['grade']/100)
            + 0.3*(df['ndays_act']/max_days)
            + 0.3*(df['nchapters']/max_chaps)
        )

        (interactions, weights) = dataset.build_interactions(
            df[['user_id','module_id','weight']].itertuples(index=False, name=None)
        )


        model = LightFM(
            no_components=120,
            learning_rate=0.05,
            item_alpha=1e-05,
            loss='warp',
            random_state=42
        )

        # Train model using interactions
        model.fit(interactions,
                    epochs=30,
                    verbose=True,
                    sample_weight=weights,
                    user_features=user_features_matrix)

        # Dump artifacts
        out = os.path.join(settings.BASE_DIR, 'recommend', 'models')
        os.makedirs(out, exist_ok=True)
        joblib.dump(model, os.path.join(out, 'lightfm_model.joblib'))
        with open(os.path.join(out, 'lightfm_dataset.pkl'),'wb') as f:
            pickle.dump(dataset.mapping(), f)

        print("Retraining complete")  