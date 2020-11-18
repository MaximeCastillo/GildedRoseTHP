/*

-Tous les éléments ont une valeur sellIn qui désigne le nombre de jours restant pour vendre l'article.
-Tous les articles ont une valeur quality qui dénote combien l'article est précieux.
-A la fin de chaque journée, notre système diminue ces deux valeurs pour chaque produit.


-Une fois que la date de péremption est passée, la qualité se dégrade deux fois plus rapidement.
-La qualité (quality) d'un produit ne peut jamais être négative.
-"Aged Brie" augmente sa qualité (quality) plus le temps passe.
-La qualité d'un produit n'est jamais de plus de 50.
-"Sulfuras", étant un objet légendaire, n'a pas de date de péremption et ne perd jamais en qualité (quality)
-"Backstage passes", comme le "Aged Brie", augmente sa qualité (quality) plus le temps passe (sellIn) ; La qualité augmente de 2 quand il reste 10 jours ou moins et de 3 quand il reste 5 jours ou moins, mais la qualité tombe à 0 après le concert.

-les éléments "Conjured" voient leur qualité se dégrader de deux fois plus vite que les objets normaux.
-"Conjured" est un préfixe au nom des éléments cela signifie que tu dois identifier quels éléments en sont (exemple: "Conjured Dark Blade", "Conjured Magic Stick")*/

var { Shop, Item } = require('../src/gilded_rose.js');
describe("GildedRose shop manager", function() {
    var listItems;

    beforeEach(function() {
        listItems = [];
    });

    it("Baisser de 1 la qualité et sellIn d'item normaux", function() {
        listItems.push(new Item("+5 Dexterity Vest", 10, 20));
        listItems.push(new Item("Mana Cake", 3, 6));

        const gildedRose = new Shop(listItems);
        const items = gildedRose.updateQuality();

        var expected = [
            { sellIn: 9, quality: 19 },
            { sellIn: 2, quality: 5 }
        ];
        expected.forEach(function(testCase, idx) {
            expect(items[idx].quality).toBe(testCase.quality);
            expect(items[idx].sellIn).toBe(testCase.sellIn);
        });
        console.log(items)

    });

    it("Augmenter la qualité de 1 pour Aged Brie et Backstage passes", function() {
        listItems.push(new Item("Aged Brie", 20, 30));
        listItems.push(new Item("Backstage passes to a TAFKAL80ETC concert", 20, 30));

        const gildedRose = new Shop(listItems);
        const items = gildedRose.updateQuality();

        var expected = [
            { sellIn: 19, quality: 31 },
            { sellIn: 19, quality: 31 },
        ];
        expected.forEach(function(testCase, idx) {
            expect(items[idx].quality).toBe(testCase.quality);
            expect(items[idx].sellIn).toBe(testCase.sellIn);
        });
    });

    it("diminue la qualité deux fois plus vite quand la date de péremption est dépassée.", function() {
        listItems.push(new Item("+5 Dexterity Vest", 0, 20));
        listItems.push(new Item("Mana Cake", -10, 6));

        const gildedRose = new Shop(listItems);
        const items = gildedRose.updateQuality();

        var expected = [
            { sellIn: -1, quality: 18 },
            { sellIn: -11, quality: 4 },
        ];
        expected.forEach(function(testCase, idx) {
            expect(items[idx].quality).toBe(testCase.quality);
            expect(items[idx].sellIn).toBe(testCase.sellIn);
        });
        console.log(items)
    });

    it("La qualité ne peut être inferieure à 0.", function() {
        listItems.push(new Item("+5 Dexterity Vest", 0, 1));
        listItems.push(new Item("Mana Cake", -10, 0));

        const gildedRose = new Shop(listItems);
        const items = gildedRose.updateQuality();

        var expected = [
            { sellIn: -1, quality: 0 },
            { sellIn: -11, quality: 0 },
        ];
        expected.forEach(function(testCase, idx) {
            expect(items[idx].quality).toBeGreaterThanOrEqual(0);
        });
        console.log(items)
    });

    it("La qualité ne peut pas dépasser 50", function() {
        listItems.push(new Item("Aged Brie", 20, 50));
        listItems.push(new Item("Backstage passes to a TAFKAL80ETC concert", -4, 49));

        const gildedRose = new Shop(listItems);
        const items = gildedRose.updateQuality();

        var expected = [
            { sellIn: 19, quality: 50 },
            { sellIn: -5, quality: 50 },
        ];
        expected.forEach(function(testCase, idx) {
            expect(items[idx].quality).toBeLessThanOrEqual(testCase.quality);
        });
    });


    it("La qualité du légendaire Sulfuras ne doit pas changer", function() {
        const item = new Item('Sulfuras, Hand of Ragnaros', null, 80)
        const gildedRose = new Shop(item);
        const itemUpdated = gildedRose.updateQuality();
        console.log(item)
        console.log(itemUpdated)
        expect(itemUpdated).toEqual(item)
    });

    it("La qualité de la Backstage passes augmente sa qualité de facon exponentielle (10 jours = +2, 5 jours = +3) puis tombe à zéro après péremption", function() {
        listItems.push(new Item("Backstage passes to a TAFKAL80ETC concert", 20, 10));
        listItems.push(new Item("Backstage passes to a TAFKAL80ETC concert", 10, 10));
        listItems.push(new Item("Backstage passes to a TAFKAL80ETC concert", 5, 10));
        listItems.push(new Item("Backstage passes to a TAFKAL80ETC concert", 1, 10));
        listItems.push(new Item("Backstage passes to a TAFKAL80ETC concert", 0, 10));


        const gildedRose = new Shop(listItems);
        const items = gildedRose.updateQuality();

        var expected = [
            { sellIn: 19, quality: 11 },
            { sellIn: 9, quality: 12 },
            { sellIn: 4, quality: 13 },
            { sellIn: 0, quality: 13 },
            { sellIn: -1, quality: 0 },
        ];
        expected.forEach(function(testCase, idx) {
            expect(items[idx].quality).toEqual(testCase.quality);
        });
    });

});